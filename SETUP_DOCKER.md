# Docker Deployment Documentation

This document outlines the procedures for deploying the BICAP Web Client environment using containerization.

## System Prerequisites

1.  **Container Runtime:** Docker Desktop installed and operational.
2.  **API Credentials:** Active Firebase Project with associated configuration keys.

## Configuration Phase 1: Global Environment Setup

Create an `.env` file in the project root with the following specifications:

```env
# Firebase Authentication Keys
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Network Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

### Retrieval of Firebase Credentials:
1. Login to the Firebase Console.
2. Access Project Settings under the General tab.
3. Scroll to the Web Application section and extract values from the configuration object.

## Configuration Phase 2: Backend Environment Specification

Ensure the `bicap-backend/.env` file contains the following parameters:

```env
# Database Connectivity
DB_HOST=sql_server
DB_NAME=BICAP
DB_USER=sa
DB_PASSWORD=BiCapProject@123
DB_PORT=1433

# Authentication Security
JWT_SECRET=your_jwt_secret_key_here

# System Port Allocation
PORT=5001
CLIENT_URL=http://localhost:3000
```

## Deployment Phase 3: Initialization

### Comprehensive Initialization
To build and start all integrated services (Database, Backend, Frontend):

```bash
docker-compose up --build
```

### Modular Deployment
To deploy services sequentially for troubleshooting or resource management:

```bash
# 1. Database Initialization
docker-compose up sql_server -d

# 2. Application Layer Build
docker-compose up backend --build

# 3. Presentation Layer Build
docker-compose up frontend --build
```

## System Monitoring and Termination

### Monitoring Logs
```bash
# Aggregate Log Output
docker-compose logs -f

# Service Filtering
docker-compose logs -f frontend
docker-compose logs -f backend
```

### Global Termination
```bash
# Stop Services
docker-compose stop

# Remove Containers
docker-compose down

# Complete Volume Reset (Warning: Data Loss)
docker-compose down -v
```

## Troubleshooting Specifications

### Configuration Errors
- Verify credential accuracy in both root and backend `.env` files.
- Ensure formatting adheres to standard environment variable syntax.

### Resource Conflicts
- Check for port occupancy on local host (3000, 5001, 1433).
- Utilize `docker-compose ps` to verify container health status.

### Build Failures
- Perform a systematic cache clearance: `docker system prune -a`.
- Reinitialize with a clean build: `docker-compose build --no-cache`.
