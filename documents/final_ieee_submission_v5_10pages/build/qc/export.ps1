param([string]$src, [string]$pdf)
$w = New-Object -ComObject Word.Application; $w.Visible = $false
try { $d = $w.Documents.Open($src, $false, $true); $d.SaveAs([ref]$pdf, [ref]17); $d.Close([ref]0) } finally { $w.Quit() }
