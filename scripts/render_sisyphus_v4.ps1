param([string]$BrowserExecutable='C:\Program Files\Google\Chrome\Application\chrome.exe')
$ErrorActionPreference='Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
function Assert-Exit { if($LASTEXITCODE -ne 0){throw "Production step failed: $LASTEXITCODE"} }
New-Item -ItemType Directory -Force out/reference | Out-Null
$v3='out/reference/Sisyphus-V3-90s.mp4'
if(!(Test-Path -LiteralPath $v3)){
 Invoke-WebRequest 'https://github.com/Houpeng0505/video-creation/releases/download/sisyphus-v3.0/Sisyphus-V3-90s.mp4' -OutFile $v3
}
$expected='BC7683E7EE003E32A48878FD8AB741D2A3004267F22F22BA0D29C710FD97AF2A'
if((Get-FileHash -LiteralPath $v3).Hash -ne $expected){throw 'V3 reference changed; inspect before reusing audio.'}
npm ci --no-audit --no-fund; Assert-Exit
npm run typecheck; Assert-Exit
node scripts/sisyphus_v4_motion_test.cjs; Assert-Exit
$renderArgs=@('remotion','render','src/index.ts','SisyphusV4','out/v4_silent.mp4','--codec=h264','--crf=18','--concurrency=4')
if(Test-Path -LiteralPath $BrowserExecutable){$renderArgs+=('--browser-executable='+$BrowserExecutable)}
& npx @renderArgs; Assert-Exit
ffmpeg -hide_banner -loglevel error -y -i out/v4_silent.mp4 -i $v3 -map 0:v:0 -map 1:a:0 -vf 'scale=in_range=full:out_range=tv' -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -color_range tv -profile:v main -level:v 3.1 -c:a copy -movflags +faststart out/Sisyphus-V4-90s.mp4
Assert-Exit
Write-Output 'Rendered. Run scripts/sisyphus_v4_qc.py with Python/Pillow/NumPy, then inspect decoded sheets before publishing.'
