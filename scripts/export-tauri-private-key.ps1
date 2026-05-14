param(
    [Parameter(Mandatory=$true)]
    [string]$PfxPath,

    [Parameter(Mandatory=$true)]
    [string]$OutPath,

    [string]$Password
)

if (-not (Test-Path $PfxPath)) {
    Write-Error "PFX file not found: $PfxPath"
    exit 1
}

if (-not $Password) {
    $secure = Read-Host -AsSecureString "Enter PFX password (leave blank if none)"
    $ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
    try {
        $Password = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($ptr)
    } finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr)
    }
}

Write-Host "Loading PFX file: $PfxPath"
try {
    $cert = New-Object System.Security.Cryptography.X509Certificates.X509Certificate2(
        $PfxPath,
        $Password,
        [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::Exportable -bor [System.Security.Cryptography.X509Certificates.X509KeyStorageFlags]::MachineKeySet
    )
} catch {
    Write-Error "Failed to load PFX file: $_"
    exit 1
}

if (-not $cert.HasPrivateKey) {
    Write-Error "PFX file does not contain a private key."
    exit 1
}

$privateKeyBytes = $null

try {
    $rsa = $cert.GetRSAPrivateKey()
    if ($rsa -ne $null) {
        $privateKeyBytes = $rsa.ExportPkcs8PrivateKey()
    }
} catch {
    Write-Host "Not an RSA private key or RSA export failed: $_"
}

if (-not $privateKeyBytes) {
    try {
        $ecdsa = $cert.GetECDsaPrivateKey()
        if ($ecdsa -ne $null) {
            $privateKeyBytes = $ecdsa.ExportPkcs8PrivateKey()
        }
    } catch {
        Write-Host "Not an ECDSA private key or ECDSA export failed: $_"
    }
}

if (-not $privateKeyBytes) {
    Write-Error "Could not export a private key from the certificate. The PFX may use an unsupported key type."
    exit 1
}

$base64 = [Convert]::ToBase64String($privateKeyBytes)
$body = $base64 -split '.{64}' | Where-Object { $_ -ne '' }

$pem = @(
    '-----BEGIN PRIVATE KEY-----',
    $body,
    '-----END PRIVATE KEY-----'
) -join "`n"

Set-Content -Path $OutPath -Value $pem -Encoding utf8

Write-Host "Private key exported successfully to '$OutPath'."
Write-Host "Copy the entire PEM content from '$OutPath' into the GitHub secret TAURI_SIGNING_PRIVATE_KEY."
