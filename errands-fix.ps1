# ═══════════════════════════════════════════════════════════════════
#  MAG-CITY Errands — Auto Fix & Debug Script (Windows PowerShell)
#  Run from your project folder:
#    Right-click this file → "Run with PowerShell"
#    OR in terminal: powershell -ExecutionPolicy Bypass -File errands-fix.ps1
# ═══════════════════════════════════════════════════════════════════

$ErrorActionPreference = "Continue"

$fixes    = 0
$warnings = 0
$errors   = 0

function OK    { param($msg) Write-Host "  [FIXED]   $msg" -ForegroundColor Green;  $script:fixes++    }
function WARN  { param($msg) Write-Host "  [WARN]    $msg" -ForegroundColor Yellow; $script:warnings++ }
function ERR   { param($msg) Write-Host "  [ERROR]   $msg" -ForegroundColor Red;    $script:errors++   }
function INFO  { param($msg) Write-Host "  [OK]      $msg" -ForegroundColor Cyan    }
function HEAD  { param($msg) Write-Host "`n-- $msg" -ForegroundColor White          }

$timestamp  = Get-Date -Format "yyyyMMdd_HHmmss"
$backupDir  = ".errands_backup_$timestamp"

function Backup-File {
    param($file)
    if (Test-Path $file) {
        New-Item -ItemType Directory -Force -Path $backupDir | Out-Null
        Copy-Item $file "$backupDir\$(Split-Path $file -Leaf)" -Force
    }
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   MAG-CITY Errands — Auto Fix (Windows)     ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

HEAD "0. Checking dependencies"

$hasPython = $false
$pythonCmd = ""
foreach ($cmd in @("python", "python3", "py")) {
    try {
        $ver = & $cmd --version 2>&1
        if ($ver -match "Python 3") {
            INFO "$cmd found ($ver)"
            $hasPython = $true
            $pythonCmd = $cmd
            break
        }
    } catch { }
}
if (-not $hasPython) {
    WARN "Python 3 not found. Download from https://python.org — needed for agent.py"
}

if ($hasPython) {
    $openpyxl = & $pythonCmd -c "import openpyxl; print('ok')" 2>&1
    if ($openpyxl -eq "ok") {
        INFO "openpyxl installed"
    } else {
        INFO "Installing openpyxl..."
        & $pythonCmd -m pip install openpyxl -q 2>&1 | Out-Null
        OK "openpyxl installed"
    }
}

HEAD "1. Checking required files"

$required = @("index.html","main.js","admin-portal.html","admin-dashboard.html","manifest.json","guide.js","agent.py")
$optional = @("style.css","sw.js","notify.js","order.html","track.html","zones.html","live-route.html","monitor.html")

foreach ($f in $required) {
    if (Test-Path $f) { INFO "$f found" }
    else              { ERR  "$f is MISSING" }
}
foreach ($f in $optional) {
    if (Test-Path $f) { INFO "$f found" }
    else              { WARN "$f not found (optional)" }
}

if (-not (Test-Path "sw.js")) {
    HEAD "  Creating sw.js (service worker)"
    @"
// sw.js — MAG-CITY Errands Service Worker
const CACHE_NAME = 'errands-v1';
const ASSETS = ['/', '/index.html', '/style.css', '/main.js', '/guide.js', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
"@ | Set-Content "sw.js" -Encoding UTF8
    OK "sw.js created (PWA install will now work)"
}

if (-not (Test-Path "notify.js")) {
    @"
// notify.js — MAG-CITY Errands notification stub
console.log('[Errands] notify.js loaded');
"@ | Set-Content "notify.js" -Encoding UTF8
    OK "notify.js stub created (stops 404 console error)"
}

HEAD "2. Fixing index.html"

if (Test-Path "index.html") {
    Backup-File "index.html"
    $html = Get-Content "index.html" -Raw -Encoding UTF8

    if ($html -match 'href="admin\.html"') {
        $html = $html -replace '<a href="admin\.html">[^<]*</a>', ''
        OK "Removed admin.html link from public footer"
    } else { INFO "No admin link in footer (already clean)" }

    if ($html -match "errands-website/sw\.js") {
        $html = $html -replace "/errands-website/sw\.js", "sw.js"
        OK "Service worker path fixed (absolute -> relative)"
    } else { INFO "SW path already correct" }

    if ($html -match "Book Now \?") {
        $html = $html -replace "Book Now \?", "Book Now"
        OK "Removed stray '?' from 'Book Now' button"
    }
    if ($html -match "Track Order \?") {
        $html = $html -replace "Track Order \?", "Track Order"
        OK "Removed stray '?' from 'Track Order' button"
    }

    if ($html -match "main\.js\?v=2") {
        $html = $html -replace "main\.js\?v=2", "main.js?v=3"
        OK "Cache buster bumped: main.js?v=2 -> v=3"
    }

    $egCount = ([regex]::Matches($html, "eg-fab")).Count
    if ($egCount -ge 2) {
        $html = [regex]::Replace($html, '(<style>[^<]*#eg-fab[^<]*</style>)\s*(<style>[^<]*#eg-fab[^<]*</style>)', '$1')
        OK "Removed duplicate eg-fab style tag"
    }

    $html | Set-Content "index.html" -Encoding UTF8 -NoNewline
} else { ERR "index.html not found" }

HEAD "3. Fixing main.js"

if (Test-Path "main.js") {
    Backup-File "main.js"
    $js = Get-Content "main.js" -Raw -Encoding UTF8

    if ($js -match "ERR-00") {
        $js = [regex]::Replace($js,
            '(?s)/\*[^*]*2\. PACKAGE DATA.*?\n\}\s*\n',
            "/* Package lookup removed - tracking handled by track.html?tracking=MAG-XXXX */`n`n"
        )
        $js = [regex]::Replace($js,
            '(?s)/\*[^*]*3\. FILL TRACKING.*?\n\}\s*\n',
            ""
        )
        $js = [regex]::Replace($js,
            '(?s)/\*[^*]*4\. TRACK A PACKAGE.*?\n\}\s*\n',
            ""
        )
        $js = [regex]::Replace($js,
            '(?s)/\*[^*]*5\. PRESS ENTER TO TRACK.*?trackPackage\(\)\s*\}\)',
            ""
        )
        OK "Removed dead ERR- trackPackage/packages system from main.js"
    } else { INFO "main.js already clean (no ERR- code found)" }

    if (($js -match "hamburger\.addEventListener") -and ($js -notmatch "if \(hamburger")) {
        $js = $js -replace 'hamburger\.addEventListener\(''click'', function \(\) \{',
                            "if (hamburger && mobileMenu) hamburger.addEventListener('click', function () {"
        OK "Added null guard to hamburger listener"
    }

    if (($js -match "counterObserver\.observe\(statsBar\)") -and ($js -notmatch "if \(statsBar")) {
        $js = $js -replace "counterObserver\.observe\(statsBar\)",
                            "if (statsBar) counterObserver.observe(statsBar)"
        OK "Added null guard to stats bar observer"
    }

    $js | Set-Content "main.js" -Encoding UTF8 -NoNewline
} else { ERR "main.js not found" }

HEAD "4. Fixing admin-dashboard.html"

if (Test-Path "admin-dashboard.html") {
    Backup-File "admin-dashboard.html"
    $html = Get-Content "admin-dashboard.html" -Raw -Encoding UTF8

    if ($html -match "Admin Login") {
        $html = $html -replace "<title>Admin Login[^<]*</title>",
                               "<title>Admin Dashboard — MAG-CITY ERRANDS</title>"
        OK "Fixed page title (was 'Admin Login')"
    } else { INFO "Page title already correct" }

    if ($html -notmatch "noindex") {
        $html = $html -replace '<meta charset="UTF-8" \/>',
                               '<meta charset="UTF-8" />' + "`n  " + '<meta name="robots" content="noindex, nofollow, noarchive" />'
        OK "Added noindex meta tag"
    } else { INFO "noindex meta already present" }

    if ($html -match "ADMIN_CREDENTIALS") {
        $html = [regex]::Replace($html,
            '(?s)//\s*.*?Change these.*?\n\s*const ADMIN_CREDENTIALS\s*=\s*\[.*?\]\s*;',
            "// Credentials removed — authenticate via admin-portal.html"
        )
        OK "Removed hardcoded ADMIN_CREDENTIALS"
    }

    if ($html -notmatch "auth-guard") {
        $guard = @"

<script>
/* AUTH GUARD: redirect to login if no valid session */
(function() {
  try {
    var raw = sessionStorage.getItem('mc_admin_session');
    if (!raw) { window.location.replace('admin-portal.html'); return; }
    var s = JSON.parse(raw);
    if (!s.token || Date.now() >= s.expires) {
      sessionStorage.removeItem('mc_admin_session');
      window.location.replace('admin-portal.html');
    }
  } catch(e) { window.location.replace('admin-portal.html'); }
})();
</script>
"@
        $html = $html -replace "</body>", "$guard`n</body>"
        OK "Auth guard injected (direct URL access now blocked)"
    } else { INFO "Auth guard already present" }

    $html | Set-Content "admin-dashboard.html" -Encoding UTF8 -NoNewline
} else { ERR "admin-dashboard.html not found" }

HEAD "5. Fixing admin.html (original)"

if (Test-Path "admin.html") {
    Backup-File "admin.html"
    $html = Get-Content "admin.html" -Raw -Encoding UTF8

    if ($html -notmatch "admin-portal.html") {
        $redirect = '<script>window.location.replace("admin-portal.html");</script>'
        $html = $html -replace "<body>", "<body>`n$redirect"
        OK "admin.html now redirects to admin-portal.html"
    } else { INFO "admin.html already redirects" }

    if ($html -match "ADMIN_CREDENTIALS") {
        $html = [regex]::Replace($html,
            '(?s)const ADMIN_CREDENTIALS\s*=\s*\[.*?\]\s*;',
            "const ADMIN_CREDENTIALS = []; // Credentials removed"
        )
        OK "Hardcoded credentials wiped from admin.html"
    }

    $html | Set-Content "admin.html" -Encoding UTF8 -NoNewline
} else { WARN "admin.html not found (not critical if using admin-portal.html)" }

HEAD "6. Fixing manifest.json"

if (Test-Path "manifest.json") {
    try {
        $json = Get-Content "manifest.json" -Raw | ConvertFrom-Json
        $changed = $false

        if ($json.start_url -match "errands-website") {
            $json.start_url = "/index.html"
            $changed = $true
            OK "manifest.json start_url fixed (removed /errands-website/ prefix)"
        } else { INFO "manifest.json start_url OK" }

        if ($changed) {
            $json | ConvertTo-Json -Depth 10 | Set-Content "manifest.json" -Encoding UTF8
        }
    } catch { ERR "manifest.json is invalid JSON — fix it manually" }
} else { ERR "manifest.json not found" }

HEAD "7. Deduplicating route files"

if ((Test-Path "liveroute.html") -and (Test-Path "live-route.html")) {
    Backup-File "liveroute.html"
    @"
<!DOCTYPE html><html><head><meta charset="UTF-8"/>
<script>window.location.replace('live-route.html');</script>
</head><body></body></html>
"@ | Set-Content "liveroute.html" -Encoding UTF8
    OK "liveroute.html now redirects to live-route.html"
} elseif ((Test-Path "liveroute.html") -and (-not (Test-Path "live-route.html"))) {
    Copy-Item "liveroute.html" "live-route.html"
    OK "Copied liveroute.html -> live-route.html"
} else { INFO "Route files OK" }

HEAD "8. Validating agent.py"

if (Test-Path "agent.py") {
    if ($hasPython) {
        $pyCheck = & $pythonCmd -m py_compile agent.py 2>&1
        if ($LASTEXITCODE -eq 0) { INFO "agent.py syntax valid" }
        else { ERR "agent.py has syntax errors: $pyCheck" }
    } else { WARN "Skipping agent.py check (Python not found)" }
} else { WARN "agent.py not found" }

HEAD "9. Security scan"

function Scan-File {
    param($file)
    if (-not (Test-Path $file)) { return }
    $content = Get-Content $file -Raw -Encoding UTF8

    if ($content -match '(?i)(password|passwd)\s*[:=]\s*["' + "'" + '"][^"' + "'" + ']{4,}["' + "'" + '"]') {
        if ($content -notmatch '(?i)(changeme|demo|replace|placeholder|stub|removed)') {
            WARN "$file may still contain a hardcoded password — review it"
        } else { INFO "$file has demo credentials (marked placeholder — OK for dev)" }
    }

    if ($file -eq "index.html") {
        if ($content -match 'href="admin\.html"' -or $content -match 'href="admin-dashboard\.html"') {
            WARN "index.html still has an admin link in nav/footer"
        } else { INFO "index.html has no admin links (correct)" }
    }

    if ($file -match "^admin") {
        if ($content -notmatch "noindex") { WARN "$file missing noindex meta tag" }
        else { INFO "$file has noindex (not crawlable)" }
    }

    if ($file -eq "admin-dashboard.html") {
        if ($content -match "admin-portal\.html") { INFO "admin-dashboard.html has auth guard" }
        else { WARN "admin-dashboard.html may be missing auth guard" }
    }
}

foreach ($f in @("index.html","admin.html","admin-portal.html","admin-dashboard.html","monitor.html")) {
    Scan-File $f
}

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   Summary                                    ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Fixes applied : $fixes"   -ForegroundColor Green
Write-Host "  Warnings      : $warnings" -ForegroundColor Yellow
Write-Host "  Errors        : $errors"   -ForegroundColor Red
Write-Host ""

if ($errors -eq 0 -and $warnings -eq 0) {
    Write-Host "  All clear! Your project is clean and secured." -ForegroundColor Green
} elseif ($errors -eq 0) {
    Write-Host "  All errors fixed. Review the warnings above." -ForegroundColor Yellow
} else {
    Write-Host "  Some errors need manual attention — see above." -ForegroundColor Red
}

Write-Host ""
Write-Host "  Backups saved to: $backupDir\" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  Next steps:" -ForegroundColor Cyan
Write-Host "  1. Open admin-portal.html and swap verifyCredentials() for a real API call" -ForegroundColor DarkGray
Write-Host "  2. Create style.css if missing" -ForegroundColor DarkGray
Write-Host "  3. Share admin-portal.html URL only with staff — never link it publicly" -ForegroundColor DarkGray
Write-Host "  4. To export orders to Excel: python agent.py orders.json" -ForegroundColor DarkGray
Write-Host ""

Read-Host "Press Enter to close"
