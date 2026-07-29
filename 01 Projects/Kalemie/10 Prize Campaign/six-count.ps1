# THE SIX — counting layer (items 1-2, plus % positions for REVELATION)
param(
    [Parameter(Mandatory=$true)][string]$Path,
    [string[]]$Markers = @()
)

$raw = (Get-Content $Path -Raw) -replace '\s+', ' '
$words = @($raw -split '\s+' | Where-Object { $_ -match '\w' })
$total = $words.Count

# --- 1. RHYTHM ---
$sentences = @([regex]::Matches($raw, '[^.!?]+[.!?]+') | ForEach-Object { $_.Value.Trim() })
$lens = @($sentences | ForEach-Object { @($_ -split '\s+' | Where-Object { $_ -match '\w' }).Count })
$short = @($lens | Where-Object { $_ -lt 10 }).Count
$long  = @($lens | Where-Object { $_ -gt 30 }).Count
$avg   = [math]::Round(($lens | Measure-Object -Average).Average, 1)

"=== 1. RHYTHM ==="
"  words            : $total"
"  sentences        : $($sentences.Count)"
"  average length   : $avg"
"  under 10 words   : $short  ($([math]::Round(100*$short/$sentences.Count))%)"
"  over 30 words    : $long  ($([math]::Round(100*$long/$sentences.Count))%)"
""

# --- 2. IGNITION (word position of first X) ---
function Pos([string]$pattern) {
    for ($i = 0; $i -lt $total; $i++) {
        if ($words[$i] -match $pattern) { return $i + 1 }
    }
    return -1
}
$firstDialogue = Pos '^[""]'
$firstProper   = -1
for ($i = 0; $i -lt $total; $i++) {
    $w = $words[$i] -replace '[^\w'']', ''
    if ($w -cmatch '^[A-Z][a-z]{2,}$' -and $i -gt 0 -and $words[$i-1] -notmatch '[.!?]$') { $firstProper = $i + 1; break }
}

"=== 2. IGNITION ==="
"  first dialogue   : word $firstDialogue  ($([math]::Round(100*$firstDialogue/$total,1))%)"
"  first proper noun: word $firstProper  ($([math]::Round(100*$firstProper/$total,1))%)"
""

# --- MARKER POSITIONS (for REVELATION %) ---
if ($Markers.Count -gt 0) {
    "=== MARKER POSITIONS ==="
    foreach ($m in $Markers) {
        $idx = $raw.IndexOf($m, [StringComparison]::OrdinalIgnoreCase)
        if ($idx -lt 0) { "  [NOT FOUND] $m"; continue }
        $before = @($raw.Substring(0, $idx) -split '\s+' | Where-Object { $_ -match '\w' }).Count
        "  {0,5:N1}%  {1}" -f (100*$before/$total), $m
    }
}
