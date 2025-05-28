#!/bin/bash

echo "🚀 Deploying HCMIU Web Project to Production..."

# Check if running in production mode
if [ "$1" = "production" ]; then
    echo "📦 Building for production..."
    
    # Set production environment variables
    export VITE_API_BASE_URL=https://hcmiu-project-web.id.vn/api
    export SPRING_PROFILES_ACTIVE=production
    
    # Stop existing containers
    echo "🛑 Stopping existing containers..."
    docker-compose -f docker-compose.production.yml down
    
    # Build and start production containers
    echo "🏗️ Building and starting production containers..."
    docker-compose -f docker-compose.production.yml up --build -d
    
    echo "✅ Production deployment complete!"
    echo "🌐 Frontend: https://hcmiu-project-web.id.vn"
    echo "🔧 Backend API: https://hcmiu-project-web.id.vn/api"
    
else
    echo "🏠 Starting development environment..."
    
    # Stop existing containers
    docker-compose down
    
    # Start development containers
    docker-compose up --build -d
    
    echo "✅ Development environment started!"
    echo "🌐 Frontend: http://localhost:5173"
    echo "🔧 Backend API: http://localhost:8080/api"
fi

echo "📋 Container status:"
docker ps
