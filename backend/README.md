# VaultQ Backend

A scalable Google Drive clone backend built with Express, TypeScript, MongoDB, and AWS S3.

## Features

- Google OAuth authentication
- File upload/download with presigned URLs
- File sharing with granular permissions
- Search functionality
- Rate limiting
- File size validation (100MB max)
- Access control (owner, public, shared)

## Tech Stack

- **Runtime**: Node.js with Express
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose
- **Storage**: AWS S3
- **Authentication**: Passport.js with Google OAuth 2.0
- **Testing**: Jest with Supertest

## Prerequisites

- Node.js 18+
- MongoDB instance
- AWS S3 bucket with IAM credentials
- Google OAuth 2.0 credentials

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/vaultq
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_bucket_name
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=your_session_secret
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Testing

```bash
npm test
```

Set `TEST_MONGODB_URI` in your environment for tests.

## API Endpoints

### Authentication

- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/google/callback` - OAuth callback
- `GET /auth/me` - Get current user (requires auth)
- `POST /auth/logout` - Logout (requires auth)

### Files

- `POST /files/upload-url` - Get presigned upload URL (requires auth)
  - Body: `{ originalName: string, size: number }`
  - Returns: `{ uploadUrl, fields, storageName, url, maxSize }`

- `POST /files/confirm-upload` - Confirm file upload and save metadata (requires auth)
  - Body: `{ originalName, storageName, url, size }`

- `GET /files?search=query` - List accessible files (requires auth)
  - Query params: `search` (optional)

- `PUT /files/:id` - Rename file (requires auth, write access)
  - Body: `{ originalName: string }`

- `DELETE /files/:id` - Delete file (requires auth, write access)

- `GET /files/:id/download` - Get presigned download URL (requires auth, read access)
  - Returns: `{ downloadUrl, expiresIn }`

### Sharing

- `POST /files/:id/share` - Share file with user (requires auth, write access)
  - Body: `{ userId: string, level: "read" | "write" }`

- `POST /files/:id/public` - Make file public (requires auth, write access)

- `POST /files/:id/private` - Make file private (requires auth, write access)

## Access Control

Files can be accessed if:
1. User is the owner (full access)
2. File is public (read access)
3. User has permission in the permissions array (based on level)

## Rate Limiting

- Auth endpoints: 50 requests/minute
- File endpoints: 100 requests/minute

## File Size Limits

- Maximum file size: 100MB
- Validated at client, backend, and S3 levels

## Docker

```bash
docker build -t vaultq-backend .
docker run -p 3000:3000 --env-file .env vaultq-backend
```

## Deployment

The backend is designed to be deployed on platforms like Render or Railway. Ensure all environment variables are set in your deployment platform.

