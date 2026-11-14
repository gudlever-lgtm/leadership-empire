param(
    [ValidateSet('apk','aab')][string]$Platform='apk',
    [switch]$SkipInstall,
    [switch]$OpenAndroidStudio
)

$scriptPath = Join-Path (Split-Path -Parent $MyInvocation.MyCommand.Path) 'build-android.ps1'
& $scriptPath -Platform $Platform -SkipInstall:$SkipInstall -OpenAndroidStudio:$OpenAndroidStudio
exit $LASTEXITCODE
