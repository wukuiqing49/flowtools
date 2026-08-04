Add-Type -AssemblyName System.Drawing

$outputDirectory = Join-Path $PSScriptRoot '..\assets\icons'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

foreach ($size in @(192, 512)) {
  $bitmap = New-Object System.Drawing.Bitmap($size, $size)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.Clear([System.Drawing.Color]::FromArgb(18, 103, 229))

  $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
  $left = [int]($size * 0.28)
  $top = [int]($size * 0.28)
  $barHeight = [int]($size * 0.085)
  $graphics.FillRectangle($brush, $left, $top, [int]($size * 0.44), $barHeight)
  $graphics.FillRectangle($brush, $left, [int]($size * 0.47), [int]($size * 0.31), $barHeight)
  $graphics.FillRectangle($brush, $left, $top, $barHeight, [int]($size * 0.44))

  $target = Join-Path $outputDirectory "icon-$size.png"
  $bitmap.Save($target, [System.Drawing.Imaging.ImageFormat]::Png)
  $brush.Dispose()
  $graphics.Dispose()
  $bitmap.Dispose()
}

Write-Output "Generated FlowTools PWA icons"
