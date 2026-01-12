# Script kiểm tra cấu hình Firebase
# Chạy: .\check-firebase-config.ps1

Write-Host "`n🔥 Kiểm Tra Cấu Hình Firebase" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan

$envFile = ".env"
$errors = @()
$warnings = @()

# Kiểm tra file .env
if (-not (Test-Path $envFile)) {
    Write-Host "`n❌ File .env không tồn tại!" -ForegroundColor Red
    Write-Host "   Vui lòng tạo file .env trong thư mục root với nội dung:" -ForegroundColor Yellow
    Write-Host "   Xem file FIREBASE_SETUP_GUIDE.md để biết cách cấu hình" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n✅ File .env đã tồn tại" -ForegroundColor Green

# Đọc file .env
$envContent = Get-Content $envFile -Raw

# Danh sách các biến cần kiểm tra
$requiredVars = @(
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID"
)

# Patterns để phát hiện placeholder
$placeholderPatterns = @(
    "your_",
    "placeholder",
    "example",
    "change_this",
    "your_firebase",
    "your_project"
)

Write-Host "`n📋 Kiểm tra từng biến môi trường:" -ForegroundColor Yellow

foreach ($var in $requiredVars) {
    # Tìm giá trị của biến
    $pattern = "$var=(.+)"
    if ($envContent -match $pattern) {
        $value = $matches[1].Trim()
        
        # Kiểm tra nếu là placeholder
        $isPlaceholder = $false
        foreach ($pattern in $placeholderPatterns) {
            if ($value -like "*$pattern*") {
                $isPlaceholder = $true
                break
            }
        }
        
        if ([string]::IsNullOrWhiteSpace($value) -or $isPlaceholder) {
            Write-Host "  ❌ $var" -ForegroundColor Red
            Write-Host "     Giá trị: $value" -ForegroundColor Gray
            $errors += $var
        } else {
            # Ẩn một phần giá trị để bảo mật
            $displayValue = if ($value.Length -gt 20) {
                $value.Substring(0, 10) + "..." + $value.Substring($value.Length - 5)
            } else {
                "***"
            }
            Write-Host "  ✅ $var" -ForegroundColor Green
            Write-Host "     Giá trị: $displayValue" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ❌ $var" -ForegroundColor Red
        Write-Host "     Không tìm thấy trong file .env" -ForegroundColor Gray
        $errors += $var
    }
}

# Tổng kết
Write-Host "`n" + "="*50 -ForegroundColor Cyan

if ($errors.Count -eq 0) {
    Write-Host "`n✅ Tất cả cấu hình Firebase đã đúng!" -ForegroundColor Green
    Write-Host "   Bạn có thể chạy ứng dụng ngay bây giờ." -ForegroundColor Green
    Write-Host "`n💡 Lưu ý: Nếu vẫn gặp lỗi, hãy rebuild Docker container:" -ForegroundColor Yellow
    Write-Host "   docker-compose build frontend" -ForegroundColor Gray
    Write-Host "   docker-compose up" -ForegroundColor Gray
    exit 0
} else {
    Write-Host "`n❌ Phát hiện $($errors.Count) lỗi cấu hình!" -ForegroundColor Red
    Write-Host "`nCác biến cần sửa:" -ForegroundColor Yellow
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    Write-Host "`n📖 Hướng dẫn:" -ForegroundColor Yellow
    Write-Host "   1. Mở file .env trong thư mục root" -ForegroundColor White
    Write-Host "   2. Thay thế các giá trị placeholder bằng giá trị thực từ Firebase Console" -ForegroundColor White
    Write-Host "   3. Xem file FIREBASE_SETUP_GUIDE.md để biết cách lấy Firebase config" -ForegroundColor White
    Write-Host "   4. Chạy lại script này để kiểm tra" -ForegroundColor White
    exit 1
}
