# Quick Start Guide

This guide provides instructions for initializing and verifying the web client environment.

## Prerequisites

### Docker Environment
- Backend Image: `xdlthdt-backend`
- Frontend Image: `xdlthdt-frontend`
- Database: SQL Server (automatically pulled during execution)

### Configuration Files
- Primary Configuration: `.env` (project root)
- Backend Configuration: `bicap-backend/.env`

## Mandatory Configuration: Firebase Authentication

Prior to system initialization, the Firebase configuration must be populated in the `.env` file located in the project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Procedure for Retrieving Credentials:
1. Access the Firebase Console.
2. Select the designated project.
3. Navigate to Project Settings > General.
4. Locate the "Your apps" section and select the Web Application.
5. Extract the required values from the `firebaseConfig` object.

## Execution Procedures

### Standard Initialization (Recommended)
```bash
docker-compose up
```

### Background Execution
```bash
docker-compose up -d
```

### Modular Initialization
```bash
# 1. Initialize Database
docker-compose up sql_server -d

# 2. Initialize Backend (Allow approximately 30 seconds for DB readiness)
docker-compose up backend

# 3. Initialize Frontend
docker-compose up frontend
```

## System Endpoints

Upon successful deployment, the following endpoints will be accessible:

- **Web Application:** http://localhost:3000
- **API Documentation/Endpoint:** http://localhost:5001/api
- **Database Server:** localhost:1433
  - Authentication: `sa` / `BiCapProject@123`

## Operational Monitoring

```bash
# Listing Active Containers
docker-compose ps

# Global Log Monitoring
docker-compose logs -f

# Service-Specific Logs
docker-compose logs -f frontend
docker-compose logs -f backend
docker-compose logs -f sql_server
```

## Termination and Cleanup

```bash
# Standard Termination
docker-compose stop

# Container Removal
docker-compose down

# Complete Reset (Destructive: Removes Containers and Persistent Volumes)
docker-compose down -v
```

## Rebuild Procedures

```bash
# Full System Rebuild
docker-compose up --build

# Specific Service Rebuild
docker-compose up --build frontend
docker-compose up --build backend
```

## Troubleshooting and Technical Support

### Authentication Failures
- Verify the integrity of the `.env` file credentials.
- Ensure no trailing whitespace exists within the key-value pairs.

### Port Conflicts
- Verify that ports 3000, 5001, and 1433 are not allocated to other processes.
- Modify port mappings in `docker-compose.yml` if necessary.

### Database Connection Integrity
- Allow sufficient initialization time for the SQL Server instance.
- Review backend logs via `docker-compose logs backend` for connection string issues.

## Technical Specifications
- Persistent data is stored within `.docker_data_new/sql/`.
- File uploads are managed globally in `bicap-backend/uploads/`.
- Valid Firebase credentials are required for frontend functionality.
