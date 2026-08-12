# IIS statik site (3282) icin koordinasyon markdown dosyalarina junction olusturur.
# Yonetici PowerShell gerekebilir.
$ErrorActionPreference = 'Stop'
$Dash = Split-Path -Parent $PSScriptRoot
$Coord = Join-Path $Dash 'coord'
$Repo = Join-Path $Dash 'repo'
$MdRoot = Split-Path -Parent $Dash
$WebRoot = Split-Path -Parent $MdRoot

function Ensure-Junction($Link, $Target) {
  if (Test-Path $Link) {
    Write-Host "OK (mevcut): $Link"
    return
  }
  cmd /c mklink /J "$Link" "$Target" | Out-Null
  Write-Host "Junction: $Link -> $Target"
}

Ensure-Junction $Coord $MdRoot
Ensure-Junction $Repo $WebRoot
Write-Host ""
Write-Host "Sonra: node scripts/build-snapshot.js"
Write-Host "IIS'te Ctrl+F5 ile yenileyin."
