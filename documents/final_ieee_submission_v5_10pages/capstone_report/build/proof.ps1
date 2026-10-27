param([string]$docx)
$w = New-Object -ComObject Word.Application; $w.Visible = $false; $w.DisplayAlerts = 0
try { $d = $w.Documents.Open($docx, $false, $true)
  $d.Content.LanguageID = 1033
  "spelling flags: " + $d.SpellingErrors.Count + " | grammar flags: " + $d.GrammaticalErrors.Count
  $seen=@{}; foreach ($e in $d.SpellingErrors) { $t=$e.Text; if (-not $seen[$t]) { $seen[$t]=1; $t } }
  $d.Close([ref]0) } finally { $w.Quit() }
