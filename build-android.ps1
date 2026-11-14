param(
    [ValidateSet('apk', 'aab')][string]$Platform = 'apk',
    [switch]$SkipInstall,
    [switch]$OpenAndroidStudio
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot
$started = Get-Date
$stage = 0
$totalStages = 5

function Step([string]$title) {
    $script:stage++
    $elapsed = (Get-Date) - $started
    Write-Host ("[{0}/{1}] {2}  |  {3:mm\:ss} elapsed" -f $script:stage, $totalStages, $title, $elapsed) -ForegroundColor Cyan
}
function Run([string]$label, [string]$exe, [string[]]$arguments) {
    Write-Host ('  ' + $label) -ForegroundColor Yellow
    & $exe @arguments
    if ($LASTEXITCODE -ne 0) { throw "$label fejlede (exit code $LASTEXITCODE)" }
}

try {
    Step 'Checking Windows build prerequisites'
    foreach ($cmd in @('node', 'npm', 'java')) {
        if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) { throw "$cmd blev ikke fundet i PATH" }
    }
    $sdk = $env:ANDROID_HOME
    if (-not $sdk) { $sdk = $env:ANDROID_SDK_ROOT }
    if (-not $sdk) { $sdk = Join-Path $env:LOCALAPPDATA 'Android\Sdk' }
    if (-not (Test-Path $sdk)) { throw "Android SDK mangler. Installer Android Studio og kontroller ANDROID_HOME ($sdk)" }

    Step 'Installing dependencies'
    if (-not $SkipInstall) { Run 'npm install' 'npm.cmd' @('install') }
    elseif (-not (Test-Path 'node_modules')) { throw 'node_modules mangler. Kør uden -SkipInstall.' }

    Step 'Preparing and syncing Android project'
    Run 'Prepare web bundle' 'npm.cmd' @('run', 'android:prepare')
    if (-not (Test-Path 'android')) { Run 'Create Android platform' 'npx.cmd' @('cap', 'add', 'android') }
    Run 'Sync Android' 'npx.cmd' @('cap', 'sync', 'android')

    Step 'Building package with Gradle'
    $gradleWrapper = Join-Path $projectRoot 'android\gradlew.bat'
    if (-not (Test-Path $gradleWrapper)) { throw 'Gradle wrapper mangler i android-projektet.' }
    $target = if ($Platform -eq 'apk') { 'assembleDebug' } else { 'bundleRelease' }
    Push-Location 'android'
    try { Run "Gradle $target" '.\gradlew.bat' @('--no-daemon', $target) }
    finally { Pop-Location }

    Step 'Reporting artifact and checksum'
    $artifact = if ($Platform -eq 'apk') {
        Join-Path $projectRoot 'android\app\build\outputs\apk\debug\app-debug.apk'
    } else {
        Join-Path $projectRoot 'android\app\build\outputs\bundle\release\app-release.aab'
    }
    if (-not (Test-Path $artifact)) { throw "Forventet build-artifact blev ikke fundet: $artifact" }
    $file = Get-Item $artifact
    $checksum = (Get-FileHash -Path $artifact -Algorithm SHA256).Hash
    Write-Host "Package: $artifact" -ForegroundColor Green
    Write-Host ("Size: {0:N2} MB" -f ($file.Length / 1MB))
    Write-Host "SHA256: $checksum"
    if ($Platform -eq 'apk') {
        $downloads = 'C:\Users\osoma\Downloads'
        if (-not (Test-Path -LiteralPath $downloads -PathType Container)) {
            throw "Download-mappen blev ikke fundet: $downloads"
        }
        $downloadApk = Join-Path $downloads 'leader.apk'
        Copy-Item -LiteralPath $artifact -Destination $downloadApk -Force
        $copiedChecksum = (Get-FileHash -LiteralPath $downloadApk -Algorithm SHA256).Hash
        if ($copiedChecksum -ne $checksum) {
            throw 'Kopiering af leader.apk fejlede checksum-kontrollen'
        }
        Write-Host "APK kopieret til: $downloadApk" -ForegroundColor Green
        Write-Host "Kopieret SHA256: $copiedChecksum"
    }
    Write-Host ("Total time: {0:mm\:ss}" -f ((Get-Date) - $started)) -ForegroundColor Green
    if ($Platform -eq 'aab') { Write-Warning 'Release AAB kræver separat signing-konfiguration, før den kan distribueres.' }
    if ($OpenAndroidStudio) { Run 'Open Android Studio' 'npx.cmd' @('cap', 'open', 'android') }
}
catch {
    Write-Error $_
    exit 1
}
