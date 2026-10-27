# Opens the generated DOCX in Word, updates every field (PAGEREF entries of the contents and lists), saves the DOCX
# with the updated page numbers and exports the PDF. Usage: export_report.ps1 -docx <abs path> -pdf <abs path>
param([string]$docx, [string]$pdf)
$w = New-Object -ComObject Word.Application; $w.Visible = $false; $w.DisplayAlerts = 0
try {
  $d = $w.Documents.Open($docx, $false, $false)
  $d.Repaginate()
  foreach ($s in $d.StoryRanges) { [void]$s.Fields.Update() }
  $d.Repaginate()
  foreach ($s in $d.StoryRanges) { [void]$s.Fields.Update() }
  $d.Save()
  $d.SaveAs([ref]$pdf, [ref]17)
  "pages: " + $d.ComputeStatistics(2)
  $d.Close([ref]0)
} finally { $w.Quit() }
