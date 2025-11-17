# Cloudflare Tunnel Setup Script for Windows
# This script helps automate the tunnel setup process

Write-Host "=== Cloudflare Tunnel Setup ===" -ForegroundColor Cyan
Write-Host ""

# Check if cloudflared is installed
Write-Host "Checking for cloudflared..." -ForegroundColor Yellow
try {
    $version = cloudflared --version 2>&1
    Write-Host "✓ cloudflared is installed: $version" -ForegroundColor Green
} catch {
    Write-Host "✗ cloudflared is not installed or not in PATH" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install cloudflared first:" -ForegroundColor Yellow
    Write-Host "  Option 1: choco install cloudflared" -ForegroundColor White
    Write-Host "  Option 2: Download from https://github.com/cloudflare/cloudflared/releases" -ForegroundColor White
    exit 1
}

Write-Host ""

# Step 1: Login
Write-Host "Step 1: Authenticate with Cloudflare" -ForegroundColor Cyan
$login = Read-Host "Have you already logged in? (y/n)"
if ($login -ne "y") {
    Write-Host "Opening browser for authentication..." -ForegroundColor Yellow
    cloudflared tunnel login
    Write-Host ""
}

# Step 2: Create tunnel
Write-Host "Step 2: Create tunnel" -ForegroundColor Cyan
$tunnelExists = cloudflared tunnel list 2>&1 | Select-String "gif-cdn"
if ($tunnelExists) {
    Write-Host "✓ Tunnel 'gif-cdn' already exists" -ForegroundColor Green
    $useExisting = Read-Host "Use existing tunnel? (y/n)"
    if ($useExisting -ne "y") {
        Write-Host "Creating new tunnel..." -ForegroundColor Yellow
        cloudflared tunnel create gif-cdn
    }
} else {
    Write-Host "Creating tunnel 'gif-cdn'..." -ForegroundColor Yellow
    cloudflared tunnel create gif-cdn
}

Write-Host ""

# Get tunnel UUID
Write-Host "Step 3: Get tunnel information" -ForegroundColor Cyan
$tunnelInfo = cloudflared tunnel info gif-cdn 2>&1
$uuidMatch = $tunnelInfo | Select-String -Pattern "([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})"
if ($uuidMatch) {
    $tunnelUUID = $uuidMatch.Matches[0].Groups[1].Value
    Write-Host "✓ Tunnel UUID: $tunnelUUID" -ForegroundColor Green
} else {
    Write-Host "✗ Could not find tunnel UUID" -ForegroundColor Red
    Write-Host "Please run: cloudflared tunnel list" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Step 4: Configure
Write-Host "Step 4: Configure tunnel" -ForegroundColor Cyan
$domain = Read-Host "Enter your domain (e.g., example.com)"
$subdomain = Read-Host "Enter subdomain for CDN (e.g., cdn) [default: cdn]"
if ([string]::IsNullOrWhiteSpace($subdomain)) {
    $subdomain = "cdn"
}
$hostname = "$subdomain.$domain"
$username = $env:USERNAME

$configDir = "$env:USERPROFILE\.cloudflared"
$configFile = "$configDir\config.yml"

# Create config directory if it doesn't exist
if (-not (Test-Path $configDir)) {
    New-Item -ItemType Directory -Path $configDir | Out-Null
}

# Create config file
$configContent = @"
tunnel: $tunnelUUID
credentials-file: C:\Users\$username\.cloudflared\$tunnelUUID.json

ingress:
  - hostname: $hostname
    service: http://localhost:3000
  - service: http_status:404
"@

Set-Content -Path $configFile -Value $configContent
Write-Host "✓ Configuration saved to: $configFile" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: DNS Setup" -ForegroundColor Cyan
Write-Host "You need to add a DNS record in Cloudflare Dashboard:" -ForegroundColor Yellow
Write-Host "  Type: CNAME" -ForegroundColor White
Write-Host "  Name: $subdomain" -ForegroundColor White
Write-Host "  Target: $tunnelUUID.cfargotunnel.com" -ForegroundColor White
Write-Host "  Proxy: Enabled (orange cloud)" -ForegroundColor White
Write-Host ""
$dnsDone = Read-Host "Have you added the DNS record? (y/n)"
if ($dnsDone -ne "y") {
    Write-Host "Please add the DNS record and wait 5-10 minutes for propagation." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Step 6: Update .env file" -ForegroundColor Cyan
$envFile = ".env"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    $newCdnUrl = "https://$hostname/gifs"
    
    if ($envContent -match "CDN_BASE_URL=(.+)") {
        $envContent = $envContent -replace "CDN_BASE_URL=.+", "CDN_BASE_URL=$newCdnUrl"
        Set-Content -Path $envFile -Value $envContent
        Write-Host "✓ Updated CDN_BASE_URL in .env to: $newCdnUrl" -ForegroundColor Green
    } else {
        Write-Host "⚠ Could not find CDN_BASE_URL in .env" -ForegroundColor Yellow
        Write-Host "Please manually add: CDN_BASE_URL=$newCdnUrl" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠ .env file not found" -ForegroundColor Yellow
    Write-Host "Please create .env and add: CDN_BASE_URL=https://$hostname/gifs" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== Setup Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Make sure your Express server is running: npm run server" -ForegroundColor White
Write-Host "2. Start the tunnel: npm run tunnel" -ForegroundColor White
Write-Host "3. Test: https://$hostname/health" -ForegroundColor White
Write-Host "4. Restart your bot: npm start" -ForegroundColor White
Write-Host ""

