<#
.SYNOPSIS
    Offline pomodoro timer with desktop notifications and sound.

.DESCRIPTION
    Runs work/break cycles entirely on this machine. No network, no install,
    no account. Pops a Windows notification and beeps at every transition,
    and can append each completed work block to a markdown log.

.EXAMPLE
    .\pomodoro.ps1
    Four rounds of 25 on / 5 off, then a 15 minute long break.

.EXAMPLE
    .\pomodoro.ps1 -Work 50 -Break 10 -Rounds 3 -Task "Chantal para 14"
    Three rounds of 50/10, labelled, for a longer drafting session.

.EXAMPLE
    .\pomodoro.ps1 -Task "Rubric scoring" -Log
    Same as default, but appends each finished block to scripts\pomodoro-log.md.

.NOTES
    Ctrl+C stops it at any point. Nothing is left running in the background.
#>

[CmdletBinding()]
param(
    # Length of a work block, in minutes.
    [ValidateRange(1, 240)]
    [int]$Work = 25,

    # Length of a short break, in minutes.
    [ValidateRange(1, 240)]
    [int]$Break = 5,

    # Length of the break after the final round, in minutes.
    [ValidateRange(1, 240)]
    [int]$LongBreak = 15,

    # How many work blocks before the long break.
    [ValidateRange(1, 20)]
    [int]$Rounds = 4,

    # What you are working on. Shown in the notification and the log.
    [string]$Task = "Writing",

    # Append each completed work block to a markdown log.
    [switch]$Log,

    # Where the log lives, if -Log is used.
    [string]$LogPath = (Join-Path $PSScriptRoot "pomodoro-log.md")
)

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

$script:Tray = $null

function Show-Alert {
    param(
        [Parameter(Mandatory)][string]$Title,
        [Parameter(Mandatory)][string]$Message
    )

    if (-not $script:Tray) {
        $script:Tray = New-Object System.Windows.Forms.NotifyIcon
        $script:Tray.Icon = [System.Drawing.SystemIcons]::Information
        $script:Tray.Visible = $true
    }

    $script:Tray.BalloonTipTitle = $Title
    $script:Tray.BalloonTipText = $Message
    $script:Tray.ShowBalloonTip(20000)

    # Beep as well, so it lands even if notifications are silenced.
    foreach ($tone in 880, 1175, 1319) { [console]::Beep($tone, 180) }
}

function Start-Countdown {
    param(
        [Parameter(Mandatory)][int]$Minutes,
        [Parameter(Mandatory)][string]$Label
    )

    $end = (Get-Date).AddMinutes($Minutes)
    while ($true) {
        $left = $end - (Get-Date)
        if ($left.TotalSeconds -le 0) { break }
        $clock = "{0:mm\:ss}" -f $left
        $host.UI.RawUI.WindowTitle = "$clock - $Label"
        Write-Host "`r  $Label  $clock  " -NoNewline -ForegroundColor Cyan
        Start-Sleep -Seconds 1
    }
    Write-Host "`r  $Label  done.        " -ForegroundColor Green
}

function Write-LogEntry {
    param([Parameter(Mandatory)][int]$Round)

    if (-not $Log) { return }

    if (-not (Test-Path $LogPath)) {
        Set-Content -Path $LogPath -Encoding utf8 -Value @(
            "# Pomodoro log"
            ""
            "Written by ``scripts\pomodoro.ps1``. One line per completed work block."
            ""
        )
    }
    $stamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    Add-Content -Path $LogPath -Encoding utf8 -Value "- $stamp - $Work min - round $Round/$Rounds - $Task"
}

try {
    $total = ($Work * $Rounds) + ($Break * ($Rounds - 1)) + $LongBreak
    Write-Host ""
    Write-Host "  $Task" -ForegroundColor White
    Write-Host "  $Rounds x ${Work}m work / ${Break}m break, then ${LongBreak}m long break" -ForegroundColor DarkGray
    Write-Host "  Finishes around $((Get-Date).AddMinutes($total).ToString('HH:mm')). Ctrl+C to stop." -ForegroundColor DarkGray
    Write-Host ""

    for ($round = 1; $round -le $Rounds; $round++) {
        Show-Alert -Title "Round $round of $Rounds - start" -Message "$Task. $Work minutes."
        Start-Countdown -Minutes $Work -Label "Round $round/$Rounds"
        Write-LogEntry -Round $round

        if ($round -lt $Rounds) {
            Show-Alert -Title "Break - $Break min" -Message "Round $round done. Stand up."
            Start-Countdown -Minutes $Break -Label "Break"
        }
    }

    Show-Alert -Title "Long break - $LongBreak min" -Message "All $Rounds rounds done. $Task."
    Start-Countdown -Minutes $LongBreak -Label "Long break"

    Show-Alert -Title "Session complete" -Message "$Rounds rounds of $Task finished."
    Write-Host ""
    Write-Host "  Session complete." -ForegroundColor Green
    if ($Log) { Write-Host "  Logged to $LogPath" -ForegroundColor DarkGray }
    Write-Host ""
}
finally {
    if ($script:Tray) {
        $script:Tray.Visible = $false
        $script:Tray.Dispose()
    }
    $host.UI.RawUI.WindowTitle = "Windows PowerShell"
}
