# Firebase Configuration Protocol

This document details the standardized procedures for configuring Firebase Authentication and Application services for the BICAP platform.

## Error Identification

If the system returns an "auth/api-key-not-valid" exception, verify that the environment variables match the credentials provided in the Firebase Console exactly.

## Step 1: Project Provisioning

1. Access the Firebase Management Console.
2. Initialize a new project or select an existing instance.
3. Configure project naming and data residency settings.

## Step 2: Application Registration

1. Within the project dashboard, select the Web platform icon (`</>`).
2. Provide a descriptive nickname for the application instance.
3. Finalize registration and extract the `firebaseConfig` parameters.

```javascript
// Reference Configuration Object
const firebaseConfig = {
  apiKey: "REDACTED_API_KEY",
  authDomain: "project-id.firebaseapp.com",
  projectId: "project-id",
  storageBucket: "project-id.appspot.com",
  messagingSenderId: "ID_STRING",
  appId: "APP_STRING"
};
```

## Step 3: Authentication Provider Configuration

1. Navigate to the Authentication module in the sidebar.
2. Initialize the service and enable the following providers:
   - Email/Password (Primary)
   - Google (Optional/OAuth)
3. Ensure authorized domains include `localhost` and any production endpoints.

## Step 4: Environment Variable Implementation

Populate the project root `.env` file with the following keys. Note that placeholder values must be replaced with operational credentials.

```env
# Production Credentials Required
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...

# Backend Proxy Configuration
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## Step 5: Validation Procedures

To verify successful configuration, execute the following diagnostic commands:

1.  **File Integrity Check:**
    ```bash
    ls -a .env
    ```

2.  **Variable Masking Check:**
    Review the file to ensure no "placeholder" or "your_key_here" strings remain.

3.  **Clean Build Execution:**
    ```bash
    docker-compose down
    docker-compose build frontend
    docker-compose up
    ```

## Technical Support and Troubleshooting

### Exception: auth/api-key-not-valid
- Ensure compliance with key casing (Case Sensitive).
- Verify the environment file is loaded within the container scope.

### Exception: auth/unauthorized-domain
- Confirm that the current execution environment domain is whitelisted in the Firebase Console Settings.

### Exception: auth/popup-blocked
- Disable browser popup blockers for the development domain to allow OAuth flow completion.

## Compliance and Requirements Checklist

- [ ] Project initialized in Firebase Console.
- [ ] Authentication providers enabled and configured.
- [ ] Environment variables populated with verified credentials.
- [ ] Frontend service rebuilt after configuration changes.
- [ ] Authentication flow validated via manual testing.
