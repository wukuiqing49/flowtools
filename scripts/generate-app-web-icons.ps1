Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$appDirectory = Join-Path $PSScriptRoot '..\assets\apps'
$slugs = @('captionmeta', 'cloud-music', 'geolens', 'pixora', 'sitereport')
$size = 192

foreach ($slug in $slugs) {
  $sourcePath = Join-Path $appDirectory "$slug\icon.png"
  $targetPath = Join-Path $appDirectory "$slug\icon-192.png"
  $source = [System.Drawing.Image]::FromFile($sourcePath)
  $bitmap = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $graphics.Clear([System.Drawing.Color]::Transparent)
  $graphics.DrawImage($source, 0, 0, $size, $size)
  $bitmap.Save($targetPath, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
  $source.Dispose()
}

Write-Output "Generated 192px web icons for $($slugs.Count) apps"
