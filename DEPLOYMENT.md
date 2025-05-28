# HCMIU Web Project - Deployment Guide

## Issue Fixed

The main issue was that the frontend was hardcoded to connect to `localhost:8080` even when accessed via the production domain. This has been fixed by:

1. **Dynamic API Base URL**: The frontend now automatically detects the environment and uses the appropriate API URL
2. **Environment Variables**: Added support for `VITE_API_BASE_URL` environment variable
3. **CORS Configuration**: Updated backend CORS settings to allow requests from your domain
4. **Production Configuration**: Added proper production configurations for both frontend and backend

## Files Modified

### Frontend Changes
- `fe/src/config/axios.js` - Dynamic API base URL detection
- `fe/.env` - Development environment variables
- `fe/.env.production` - Production environment variables
- `fe/vite.config.js` - Enhanced build and preview configuration

### Backend Changes
- `be/src/main/java/com/example/hcmiuweb/config/CorsConfig.java` - Added domain to CORS
- `be/src/main/java/com/example/hcmiuweb/config/SecurityConfig.java` - Updated CORS origins
- `be/src/main/java/com/example/hcmiuweb/controllers/TestController.java` - Updated CORS
- `be/src/main/java/com/example/hcmiuweb/controllers/RatingController.java` - Updated CORS
- `be/src/main/java/com/example/hcmiuweb/controllers/RoleController.java` - Updated CORS
- `be/src/main/java/com/example/hcmiuweb/controllers/VideoController.java` - Updated CORS
- `be/src/main/resources/application-production.properties` - Production config

### Infrastructure
- `docker-compose.production.yml` - Production deployment configuration
- `nginx.conf` - Reverse proxy configuration
- `deploy.sh` - Automated deployment script

## Deployment Instructions

### For Development
```bash
# Start development environment
./deploy.sh

# Or manually:
docker-compose up --build -d
```

### For Production
```bash
# Deploy to production
./deploy.sh production

# Or manually:
docker-compose -f docker-compose.production.yml up --build -d
```

## Environment Variables

### Frontend (.env files)
```bash
# Development
VITE_API_BASE_URL=http://localhost:8080/api

# Production
VITE_API_BASE_URL=https://hcmiu-project-web.id.vn/api
```

### Backend
```bash
# Production
SPRING_PROFILES_ACTIVE=production
```

## URLs

### Development
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api

### Production
- Frontend: https://hcmiu-project-web.id.vn
- Backend API: https://hcmiu-project-web.id.vn/api

## Troubleshooting

1. **CORS Errors**: Ensure your domain is added to all CORS configurations
2. **Connection Refused**: Check that the backend is running and accessible
3. **Environment Variables**: Verify that the correct environment variables are set
4. **SSL Issues**: For HTTPS, ensure SSL certificates are properly configured in nginx

## Next Steps

1. Configure SSL certificates for HTTPS
2. Set up proper domain DNS configuration
3. Configure monitoring and logging for production
4. Set up CI/CD pipeline for automated deployments
