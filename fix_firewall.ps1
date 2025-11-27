# Run this script as Administrator
Write-Host "Adding Windows Firewall rule for Flask..." -ForegroundColor Yellow

# Add inbound rule for port 5000
New-NetFirewallRule -DisplayName "Python Flask 5000" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow

Write-Host "Firewall rule added successfully!" -ForegroundColor Green
Write-Host "You can now access Flask from your phone" -ForegroundColor Green
