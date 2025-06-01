# PowerShell deployment script for Windows
param(
    [string]$Mode = "development"
)

Write-Host "🚀 Deploying HCMIU Web Project..." -ForegroundColor Green

if ($Mode -eq "production") {
    Write-Host "📦 Building for production..." -ForegroundColor Yellow
    
    # Set environment variables
    $env:VITE_API_BASE_URL = "https://hcmiu-project-web.id.vn/api"
    $env:SPRING_PROFILES_ACTIVE = "production"
    
    # Stop existing containers
    Write-Host "🛑 Stopping existing containers..." -ForegroundColor Red
    docker-compose -f docker-compose.production.yml down
    
    # Build and start production containers
    Write-Host "🏗️ Building and starting production containers..." -ForegroundColor Blue
    docker-compose -f docker-compose.production.yml up --build -d
    
    Write-Host "✅ Production deployment complete!" -ForegroundColor Green
    Write-Host "🌐 Frontend: https://hcmiu-project-web.id.vn" -ForegroundColor Cyan
    Write-Host "🔧 Backend API: https://hcmiu-project-web.id.vn/api" -ForegroundColor Cyan
    
} else {
    Write-Host "🏠 Starting development environment..." -ForegroundColor Yellow
    
    # Stop existing containers
    docker-compose down
    
    # Start development containers
    docker-compose up --build -d
    
    Write-Host "✅ Development environment started!" -ForegroundColor Green
    Write-Host "🌐 Frontend: http://localhost:5173" -ForegroundColor Cyan
    Write-Host "🔧 Backend API: http://localhost:8080/api" -ForegroundColor Cyan
}

Write-Host "📋 Container status:" -ForegroundColor Magenta
docker ps
