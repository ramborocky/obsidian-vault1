$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.IO.Compression.FileSystem
$NL = [char]10
$SP = "C:\Users\user\AppData\Local\Temp\claude\C--Users-user-Documents-obsidian-vault1-main\b8cd058c-c44e-47c6-a05f-2d89d99de4f8\scratchpad"
$OUT = "C:\Users\user\Documents\obsidian-vault1-main\01 Projects\x-factor\Annotated"

$techObj = Get-Content "$SP\techniques.json" -Raw -Encoding UTF8 | ConvertFrom-Json
# PS 5.1 has no -AsHashtable; dynamic member access on PSCustomObject is unreliable here, so build a real map
$TECH = @{}
foreach ($prop in $techObj.PSObject.Properties) { $TECH[$prop.Name] = $prop.Value }
"techniques loaded: $($TECH.Count)"

function Read-Docx([string]$p) {
  $zip = [IO.Compression.ZipFile]::OpenRead($p)
  try {
    $e  = $zip.Entries | Where-Object { $_.FullName -eq 'word/document.xml' }
    $sr = New-Object IO.StreamReader($e.Open()); $x = $sr.ReadToEnd(); $sr.Close()
  } finally { $zip.Dispose() }
  $t = $x -replace '<w:p[ >]', "$NL$NL<w:p " -replace '<w:br[^>]*>', $NL
  $t = [regex]::Replace($t, '<[^>]+>', '')
  $t -replace '&amp;','&' -replace '&lt;','<' -replace '&gt;','>' -replace '&quot;','"' -replace '&apos;',"'"
}

function Render-Tech([string]$codes) {
  if (-not $codes) { return $null }
  $parts = @()
  foreach ($c in ($codes -split ',')) {
    $c = $c.Trim(); if (-not $c) { continue }
    $d = $script:TECH[$c]
    if ($d) { $parts += "**$($d.b):** [[$($d.l)]] — *$($d.t)*" }
    else    { $parts += "**?$c**" }
  }
  if ($parts.Count -eq 0) { return $null }
  return ($parts -join ' · ')
}

function Build($src, $jsonPath, $xPath, $outPath, $header, $startAt) {
  if ($src -like '*.docx') { $text = Read-Docx $src } else { $text = [IO.File]::ReadAllText($src, [Text.Encoding]::UTF8) }
  $text = [regex]::Replace($text.Trim(), "$NL{3,}", "$NL$NL")
  if ($startAt) { $i = $text.IndexOf($startAt); if ($i -gt 0) { $text = $text.Substring($i) } }

  $paras = @()
  foreach ($p in ($text -split "$NL$NL")) {
    $q = (($p.Trim() -replace "$NL", ' ') -replace '\s+', ' ').Trim()
    if ($q.Length -gt 0 -and $q -ne '-' -and $q -ne [string][char]0x2013) { $paras += $q }
  }

  $total = ($paras -join ' ').Length
  $ann   = Get-Content $jsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
  $xmap  = $null
  if ($xPath -and (Test-Path $xPath)) { $xmap = Get-Content $xPath -Raw -Encoding UTF8 | ConvertFrom-Json }

  $used = @{}; $hits = 0; $codesSeen = @{}
  $sb = New-Object Text.StringBuilder
  [void]$sb.AppendLine($header)

  $run = 0
  for ($i = 0; $i -lt $paras.Count; $i++) {
    $p = $paras[$i]
    [void]$sb.AppendLine($p); [void]$sb.AppendLine()
    $run += $p.Length + 1
    $pct = [math]::Round(100 * $run / $total, 1)

    foreach ($a in $ann) {
      if ($used.ContainsKey($a.a)) { continue }
      if ($p.IndexOf($a.a, [StringComparison]::OrdinalIgnoreCase) -lt 0) { continue }
      $used[$a.a] = $true; $hits++

      $codes = $null
      if ($a.PSObject.Properties.Name -contains 'x' -and $a.x) { $codes = $a.x }
      elseif ($xmap -and ($xmap.PSObject.Properties.Name -contains $a.a)) { $codes = $xmap.($a.a) }
      if ($codes) { foreach ($c in ($codes -split ',')) { $codesSeen[$c.Trim()] = $true } }

      [void]$sb.AppendLine("> [!$($a.t)] $pct% · $($a.g)")
      foreach ($line in ($a.n -split "`n")) { [void]$sb.AppendLine("> $line") }
      $techLine = Render-Tech $codes
      if ($techLine) { [void]$sb.AppendLine('> '); [void]$sb.AppendLine("> 🎓 $techLine") }
      [void]$sb.AppendLine()
    }
  }

  [IO.File]::WriteAllText($outPath, $sb.ToString(), (New-Object Text.UTF8Encoding($false)))
  $missed = @(); foreach ($a in $ann) { if (-not $used.ContainsKey($a.a)) { $missed += $a.a } }
  $bad = @(); foreach ($c in $codesSeen.Keys) { if (-not $script:TECH[$c]) { $bad += $c } }
  [pscustomobject]@{ Out=(Split-Path $outPath -Leaf); Paras=$paras.Count; Placed=$hits; Total=$ann.Count; Techniques=$codesSeen.Count; Missed=$missed; BadCodes=$bad }
}

New-Item -ItemType Directory -Force -Path $OUT | Out-Null

$howto = @"
> [!abstract] How to read this file
> **The prose is the author's. Every callout is mine.** Built by script from the source text in ``_source texts/`` — percentages are computed from real character offsets, not estimated, so ``43.2%`` means the annotated paragraph ends 43.2% of the way through.
>
> ``[!danger]`` turn, climax or hinge · ``[!tip]`` plant · ``[!success]`` payoff or technique landing · ``[!warning]`` beat that misdirects · ``[!note]`` craft observation or leakage · ``[!quote]`` motif tracking
>
> **🎓 lines link every observation to the craft base that names the principle** — McKee, Cleland, Gardner, Barrett, Kiteley, and the vault's own instruments. Follow them. That is what this folder is for. → [[x-factor]]
>
> Private study markup — **gitignored, do not push.**
"@

$hM = @"
---
tags: [x-factor, annotated, benchmark, craft, close-reading, training]
aliases: [Mothers Annotated]
date: 2026-07-31
story_author: Joshua Lubwama
prize: "Africa regional winner, Commonwealth Short Story Prize 2025"
source: Granta / Commonwealth Foundation
role: study markup — story text is the author's, annotations are Claude's
---

# ANNOTATED · *Mothers Not Appearing in Search*

**Joshua Lubwama** — Africa regional winner, Commonwealth Short Story Prize 2025, published by Granta in partnership with the Commonwealth Foundation.

**Study this one for:** the child narrator as a structural device, the retroactive re-read, and comedy carrying atrocity.

$howto

Copyright in the story remains Joshua Lubwama's.

---

"@

$hD = @"
---
tags: [x-factor, annotated, benchmark, craft, close-reading, training]
aliases: [Dite Annotated]
date: 2026-07-31
story_author: unattributed in the supplied file — provenance unverified
role: study markup — story text is the author's, annotations are Claude's
---

# ANNOTATED · *Dite*

> [!warning] Provenance
> No byline, no publication line. **Checked 2026-07-31: it is not a 2025 Commonwealth regional winner.** Standing unknown. Copyright remains the author's. → [[Dite — Story Sheet]]

**Study this one for:** instruction-as-epigraph, a single unexplained body-motif carrying the controlling idea, and long-range plants.

> [!tip] Two motifs to follow all the way down
> **The throat** — six appearances, thirty years, never explained. **Tall** — five appearances, landing inside a colonial ledger. **Four epigraphs** shift register from family recipe to colonial brochure; that sequence is the argument, and no prose ever states it.

$howto

---

"@

$hN = @"
---
tags: [x-factor, annotated, benchmark, craft, close-reading, training, winner]
aliases: [Nazir Annotated, Serpent Annotated]
date: 2026-07-31
story_author: Jamir Nazir
prize: "WINNER — Commonwealth Short Story Prize 2026 (Caribbean regional, then overall)"
source: Granta
role: study markup — story text is the author's, annotations are Claude's
---

# ANNOTATED · *The Serpent in the Grove*

**Jamir Nazir** — **overall winner, Commonwealth Short Story Prize 2026**, from 7,806 entries. Published in Granta. Chair of judges Louise Doughty: *"an original, poetic and deeply moving story."*

**Study this one for:** what a winner actually looks like — including its faults. It scores **31/45** on [[The Judging Rubric — Nine Axes]] and beat 7,805 other stories.

> [!danger] Read the faults as carefully as the strengths
> This story loses points on **economy, close and controlling idea** — all architectural — and won. **45% of it is aftermath.** The coda states the theme outright. Barrett's end-within-a-paragraph rule is not broken but inverted.
>
> Six years of chair statements show no panel has ever rewarded architecture. → [[14 The Judges — Six Years of Chair Statements]]

$howto

Copyright in the story remains Jamir Nazir's.

---

"@

Build "$SP\b.docx" "$SP\ann-mothers.json" "$SP\x-mothers.json" "$OUT\Mothers Not Appearing in Search — ANNOTATED.md" $hM 'The first time we came home'
Build "$SP\a.docx" "$SP\ann-dite.json"    "$SP\x-dite.json"    "$OUT\Dite — ANNOTATED.md"                            $hD $null
Build "C:\Users\user\Documents\obsidian-vault1-main\01 Projects\Kalemie\10 Prize Campaign\03 Story Sheets\_source texts\nazir-serpent-in-the-grove.txt" "$SP\ann-nazir.json" $null "$OUT\The Serpent in the Grove — ANNOTATED.md" $hN 'They say the grove still hums'

