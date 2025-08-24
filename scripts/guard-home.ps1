param()

$ErrorActionPreference = "Stop"

function Assert-NoOnboardingInHome {
  $res = Invoke-WebRequest http://localhost:3000/ -UseBasicParsing
  Write-Output ("HOME_STATUS: {0}" -f $res.StatusCode)

  $markers = @(
    'data-testid="btn-open-onboarding"',
    'はじめにへ（登録に進む）',
    'class="text-lg font-medium">はじめに<'
  )

  $found = $false
  foreach ($m in $markers) {
    if ($res.Content -match $m) {
      Write-Output ("FOUND: {0}" -f $m)
      $found = $true
    }
  }

  if ($found) {
    Write-Error "GUARD_FAIL: Onboarding UI detected on Home"
    exit 1
  } else {
    Write-Output "GUARD_OK: No onboarding UI on Home"
    exit 0
  }
}

Assert-NoOnboardingInHome
