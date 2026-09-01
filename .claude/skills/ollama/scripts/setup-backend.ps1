#Requires -Version 5.1
<#
    setup-backend.ps1 - unattended setup of a local model as a Claude Code backend.

    Pulls the model (resuming and retrying until it lands), builds a large-context
    variant, points claude-code-router at it, then tests whether the model can
    actually emit parseable tool calls. Safe to re-run; every step is idempotent.

    Logs to $LogPath so you can read what happened after you get back.
#>
[CmdletBinding()]
param(
    [string] $Model    = 'llama3.1:8b',
    [int]    $NumCtx   = 32768,
    [int]    $MaxHours = 12,
    [int]    $RetrySec = 60,
    [int]    $StallSec = 240,
    [string] $LogPath  = "$env:USERPROFILE\ollama-setup.log"
)

$ErrorActionPreference = 'Stop'
$variant = "$($Model.Split(':')[0]):$($Model.Split(':')[1])-$([int]($NumCtx/1024))k"

function Write-Log {
    param([string]$Message, [string]$Level = 'INFO')
    $line = "[{0}] {1,-5} {2}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $Level, $Message
    Write-Host $line
    Add-Content -Path $LogPath -Value $line -Encoding utf8
}

function Get-OllamaExe {
    $known = "$env:LOCALAPPDATA\Programs\Ollama\ollama.exe"
    if (Test-Path $known) { return $known }
    $cmd = Get-Command ollama -ErrorAction SilentlyContinue
    if ($cmd) { return $cmd.Source }
    throw "ollama.exe not found. Install Ollama or pass its folder on PATH."
}

Write-Log "=== setup-backend starting ==="
Write-Log "model=$Model variant=$variant num_ctx=$NumCtx log=$LogPath"

$ollama = Get-OllamaExe
Write-Log "using $ollama"

# The router config and model store are per-user. Launched from an elevated shell
# running as a different account, every path below silently points somewhere wrong.
$cfgPath = Join-Path $env:USERPROFILE '.claude-code-router\config.json'
if (-not (Test-Path $cfgPath)) {
    Write-Log "no router config under $env:USERPROFILE (running as $env:USERNAME)" "ERROR"
    Write-Log "run this from a normal shell as the account that installed Ollama" "ERROR"
    exit 1
}

# --- 0. make sure the server is up -----------------------------------------
try {
    Invoke-RestMethod -Uri 'http://localhost:11434/api/tags' -TimeoutSec 5 | Out-Null
    Write-Log "ollama server is reachable"
} catch {
    Write-Log "server not responding, starting it" 'WARN'
    Start-Process -FilePath $ollama -ArgumentList 'serve' -WindowStyle Hidden
    Start-Sleep -Seconds 5
}

# --- 1. pull, surviving outages and hung transfers ---------------------------
# Two failure modes matter here. A dropped connection makes pull exit non-zero,
# which is easy. A dead network makes it hang forever without exiting, which the
# naive retry loop never catches - so progress is watched directly and a stalled
# transfer is killed rather than waited on. Partial blobs are kept, so every
# retry resumes rather than restarting.

function Test-Registry {
    try {
        Invoke-WebRequest "https://registry.ollama.ai/v2/" -TimeoutSec 15 -UseBasicParsing -Method Head | Out-Null
        return $true
    } catch {
        # An HTTP response of any kind (401 is normal here) means we got through.
        if ($_.Exception.Response) { return $true }
        return $false
    }
}

function Get-StoreSize {
    $d = Join-Path $env:USERPROFILE ".ollamamodelslobs"
    if (-not (Test-Path $d)) { return 0 }
    $m = Get-ChildItem $d -File -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum
    if ($m.Sum) { return [int64]$m.Sum } else { return [int64]0 }
}

function Test-ModelPresent {
    param([string]$Name)
    try {
        $tags = Invoke-RestMethod "http://localhost:11434/api/tags" -TimeoutSec 10
        return [bool]($tags.models | Where-Object { $_.name -eq $Name })
    } catch { return $false }
}

$deadline = (Get-Date).AddHours($MaxHours)
$pulled   = $false
$attempt  = 0

while ((Get-Date) -lt $deadline) {
    if (Test-ModelPresent $Model) { $pulled = $true; Write-Log "$Model already present"; break }

    if (-not (Test-Registry)) {
        Write-Log "registry unreachable (network down), waiting ${RetrySec}s" "WARN"
        Start-Sleep -Seconds $RetrySec
        continue
    }

    $attempt++
    Write-Log "pull attempt $attempt for $Model (resumes from partial data)"

    $job      = Start-Job -ScriptBlock { param($exe, $m) & $exe pull $m 2>&1 } -ArgumentList $ollama, $Model
    $lastSize = Get-StoreSize
    $lastMove = Get-Date

    while ($job.State -eq "Running") {
        Start-Sleep -Seconds 15
        $now = Get-StoreSize
        if ($now -ne $lastSize) {
            $delta    = [math]::Round(($now - $lastSize) / 1MB, 1)
            $lastSize = $now
            $lastMove = Get-Date
            Write-Log ("downloading: {0:N0} MB total (+{1} MB)" -f ($now / 1MB), $delta)
        } elseif (((Get-Date) - $lastMove).TotalSeconds -ge $StallSec) {
            Write-Log "no progress for ${StallSec}s, killing stalled transfer" "WARN"
            Stop-Job $job -ErrorAction SilentlyContinue
            break
        }
        if ((Get-Date) -ge $deadline) { Stop-Job $job -ErrorAction SilentlyContinue; break }
    }

    Receive-Job $job -ErrorAction SilentlyContinue | ForEach-Object { Write-Host $_ }
    Remove-Job $job -Force -ErrorAction SilentlyContinue

    # Exit codes are unreliable across a killed job; ask the server what it has.
    if (Test-ModelPresent $Model) { $pulled = $true; Write-Log "pull succeeded"; break }

    Write-Log "incomplete, retrying in ${RetrySec}s" "WARN"
    Start-Sleep -Seconds $RetrySec
}

if (-not $pulled) {
    Write-Log "gave up after $MaxHours hours - $Model never finished downloading" "ERROR"
    Write-Log "partial data is kept; re-run this script to resume" "ERROR"
    exit 1
}

# --- 2. large-context variant ----------------------------------------------
# Ollama defaults to a small context. Claude Code's system prompt alone exceeds it.
# A derived model reuses the parent's weight blobs, so this costs no extra disk.
$modelfile = Join-Path $env:TEMP "Modelfile.$($variant -replace '[:.]','_')"
@"
FROM $Model
PARAMETER num_ctx $NumCtx
PARAMETER temperature 0.2
"@ | Set-Content -Path $modelfile -Encoding utf8

Write-Log "building $variant"
& $ollama create $variant -f $modelfile 2>&1 | ForEach-Object { Write-Host $_ }
if ($LASTEXITCODE -ne 0) { Write-Log "create failed (exit $LASTEXITCODE)" 'ERROR'; exit 1 }
Write-Log "variant ready"

# --- 3. point the router at it ---------------------------------------------
$cfgPath = Join-Path $env:USERPROFILE '.claude-code-router\config.json'
if (Test-Path $cfgPath) {
    Copy-Item $cfgPath "$cfgPath.bak" -Force
    $cfg = Get-Content $cfgPath -Raw -Encoding utf8 | ConvertFrom-Json

    $prov = $cfg.Providers | Where-Object { $_.name -eq 'ollama' } | Select-Object -First 1
    if ($prov) {
        if ($prov.models -notcontains $variant) { $prov.models = @($prov.models) + $variant }
        foreach ($k in @('default','background','think','longContext','webSearch')) {
            if ($cfg.Router.PSObject.Properties.Name -contains $k) {
                $cfg.Router.$k = "ollama,$variant"
            }
        }
        $cfg | ConvertTo-Json -Depth 10 | Set-Content -Path $cfgPath -Encoding utf8
        Write-Log "router config updated (backup at config.json.bak)"
    } else {
        Write-Log "no 'ollama' provider in config.json, left it alone" 'WARN'
    }
} else {
    Write-Log "no router config at $cfgPath, skipping" 'WARN'
}

# --- 4. the test that actually matters --------------------------------------
# Claude Code's loop is nothing but tool calls. If the model cannot emit a
# parseable one, the backend is useless no matter how well everything else works.
Write-Log "testing tool calling (this is slow on CPU, allow a few minutes)"
$body = @{
    model    = $variant
    stream   = $false
    messages = @(@{ role = 'user'; content = 'Read the file /etc/hosts using the read_file tool.' })
    tools    = @(@{
        type     = 'function'
        function = @{
            name        = 'read_file'
            description = 'Read a file from disk'
            parameters  = @{
                type       = 'object'
                properties = @{ path = @{ type = 'string' } }
                required   = @('path')
            }
        }
    })
} | ConvertTo-Json -Depth 10

try {
    $r = Invoke-RestMethod -Uri 'http://localhost:11434/api/chat' -Method Post `
                           -Body $body -ContentType 'application/json' -TimeoutSec 900
    if ($r.message.tool_calls) {
        Write-Log "TOOL CALLS WORK: $($r.message.tool_calls | ConvertTo-Json -Compress -Depth 5)" 'OK'
        Write-Log "backend is usable. Launch Claude Code through it with: ccr code"
    } else {
        Write-Log "no structured tool_calls; model returned text instead" 'ERROR'
        Write-Log "content was: $($r.message.content)" 'ERROR'
        Write-Log "this model cannot drive the agent loop either. Try: qwen3:4b" 'ERROR'
    }
    if ($r.eval_count -and $r.eval_duration) {
        Write-Log ("throughput: {0:N1} tok/s" -f ($r.eval_count / ($r.eval_duration / 1e9)))
    }
} catch {
    Write-Log "tool test failed: $($_.Exception.Message)" 'ERROR'
}

Write-Log "=== setup-backend finished ==="
