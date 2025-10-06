$publicKey = Get-Content "$env:USERPROFILE\.ssh\rpi_key.pub"
$sshCommand = "mkdir -p ~/.ssh && echo '$publicKey' >> ~/.ssh/authorized_keys && chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"

# Use plink (if available) or ssh to copy the key
try {
    plink -ssh -pw "1" pi@rpi $sshCommand
} catch {
    Write-Host "plink not found, using ssh..."
    # This will still prompt for password once
    ssh pi@rpi $sshCommand
}