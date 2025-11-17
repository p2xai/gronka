# Copy Cloudflare tunnel credentials to config directory for Docker
$sourcePath = "$env:USERPROFILE\.cloudflared\bc30525a-afea-4486-afcd-d1ab37f4c6f6.json"
$destPath = ".\config\credentials.json"

if (Test-Path $sourcePath) {
    Copy-Item -Path $sourcePath -Destination $destPath -Force
    Write-Host "Credentials file copied successfully to $destPath"
} else {
    Write-Host "Error: Credentials file not found at $sourcePath"
    Write-Host "Please check the path and try again."
    exit 1
}

