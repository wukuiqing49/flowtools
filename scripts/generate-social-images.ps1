Add-Type -AssemblyName System.Drawing
$ErrorActionPreference = 'Stop'

$outputDirectory = Join-Path $PSScriptRoot '..\assets\social'
New-Item -ItemType Directory -Force -Path $outputDirectory | Out-Null

$products = @(
  @{ Slug = 'sitereport'; Name = 'SiteReport'; Category = 'Site inspection'; Background = '#f1f6fb'; Accent = '#207bd7'; Ink = '#0a1828'; Muted = '#516271' },
  @{ Slug = 'captionmeta'; Name = 'CaptionMeta'; Category = 'Photo metadata'; Background = '#083d63'; Accent = '#8bc7f0'; Ink = '#ffffff'; Muted = '#c8dfef' },
  @{ Slug = 'cloud-music'; Name = 'Cloud Music'; Category = 'Music player'; Background = '#f0f1f1'; Accent = '#16a34a'; Ink = '#111315'; Muted = '#596168' },
  @{ Slug = 'geolens'; Name = 'GeoLens'; Category = 'Field photography'; Background = '#0c1411'; Accent = '#8bdcbb'; Ink = '#f5faf7'; Muted = '#bdd0c7' },
  @{ Slug = 'pixora'; Name = 'Pixora'; Category = 'Offline photo AI'; Background = '#101012'; Accent = '#a878ef'; Ink = '#ffffff'; Muted = '#bbb9c7' }
)

function New-Canvas($background) {
  $bitmap = New-Object System.Drawing.Bitmap(1200, 630)
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  $graphics.Clear([System.Drawing.ColorTranslator]::FromHtml($background))
  return @{ Bitmap = $bitmap; Graphics = $graphics }
}

$ink = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 24, 32))
$blue = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(18, 103, 229))
$muted = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(76, 88, 99))
$white = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$titleFont = New-Object System.Drawing.Font('Segoe UI', 56, [System.Drawing.FontStyle]::Bold)
$brandFont = New-Object System.Drawing.Font('Segoe UI', 25, [System.Drawing.FontStyle]::Bold)
$bodyFont = New-Object System.Drawing.Font('Segoe UI', 24, [System.Drawing.FontStyle]::Regular)

$homeCanvas = New-Canvas '#101820'
$homeCanvas.Graphics.FillRectangle($ink, 0, 0, 1200, 630)
$homeCanvas.Graphics.FillRectangle($blue, 78, 78, 52, 52)
$homeCanvas.Graphics.FillRectangle($white, 91, 92, 28, 7)
$homeCanvas.Graphics.FillRectangle($white, 91, 107, 20, 7)
$homeCanvas.Graphics.FillRectangle($white, 91, 92, 7, 27)
$homeCanvas.Graphics.DrawString('FlowTools', $titleFont, $white, 160, 65)
$homeCanvas.Graphics.DrawString('Practical Android apps for real work', $bodyFont, $white, 82, 175)

for ($index = 0; $index -lt $products.Count; $index++) {
  $iconPath = Join-Path $PSScriptRoot "..\assets\apps\$($products[$index].Slug)\icon.png"
  $icon = [System.Drawing.Image]::FromFile($iconPath)
  $homeCanvas.Graphics.DrawImage($icon, 82 + ($index * 190), 300, 140, 140)
  $icon.Dispose()
}

$homeCanvas.Graphics.DrawString('AndroidManTou', $brandFont, $white, 82, 510)
$homeCanvas.Bitmap.Save((Join-Path $outputDirectory 'home.png'), [System.Drawing.Imaging.ImageFormat]::Png)
$homeCanvas.Graphics.Dispose()
$homeCanvas.Bitmap.Dispose()

foreach ($product in $products) {
  $canvas = New-Canvas $product.Background
  $accentBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($product.Accent))
  $inkBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($product.Ink))
  $mutedBrush = New-Object System.Drawing.SolidBrush([System.Drawing.ColorTranslator]::FromHtml($product.Muted))
  $canvas.Graphics.FillRectangle($accentBrush, 0, 0, 22, 630)
  $iconPath = Join-Path $PSScriptRoot "..\assets\apps\$($product.Slug)\icon.png"
  $icon = [System.Drawing.Image]::FromFile($iconPath)
  $canvas.Graphics.DrawImage($icon, 90, 185, 260, 260)
  $canvas.Graphics.DrawString($product.Name, $titleFont, $inkBrush, 420, 190)
  $canvas.Graphics.DrawString($product.Category, $bodyFont, $mutedBrush, 425, 285)
  $canvas.Graphics.DrawString('Android app by FlowTools', $brandFont, $accentBrush, 425, 365)
  $canvas.Bitmap.Save((Join-Path $outputDirectory "$($product.Slug).png"), [System.Drawing.Imaging.ImageFormat]::Png)
  $icon.Dispose()
  $accentBrush.Dispose()
  $inkBrush.Dispose()
  $mutedBrush.Dispose()
  $canvas.Graphics.Dispose()
  $canvas.Bitmap.Dispose()
}

$ink.Dispose()
$blue.Dispose()
$muted.Dispose()
$white.Dispose()
$titleFont.Dispose()
$brandFont.Dispose()
$bodyFont.Dispose()

Write-Output "Generated FlowTools social images"
