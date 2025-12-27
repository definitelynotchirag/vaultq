GOOGLE DRIVE SCALABLE CLONE

```
Client
  |
  | Google OAuth login, file CRUD requests, search, sharing, get presigned URLs
  v
Backend (Node Express)
  - Google OAuth (passport-google-oauth20)
  - Session or JWT auth middleware protecting all file routes
  - File operations: upload url, confirm upload, list, search, rename, delete
  - Sharing logic: public flag or sharedWith user list
  - File size limits: client check + multer/busboy + S3 content length rules
  - Rate limiting for key endpoints
  |
  v
MongoDB
  - users collection: googleId, email, name
  - files collection: owner, originalName, storageName, size, timestamps, public flag, permissions array
  - text or regex index on originalName for searching
  |
  v
S3 Bucket
  - actual file storage
  - direct uploads using presigned URLs from backend
  - presigned short lived download URLs for access controlled reads

```

Data models

```ts
User {
  _id: ObjectId
  googleId: string
  email: string
  name: string
}

File {
  _id: ObjectId
  owner: ObjectId
  originalName: string
  storageName: string
  url: string
  size: number
  public: boolean

  // permissions
  permissions: [
    {
      userId: ObjectId,
      level: "read" | "write"
    }
  ]

  createdAt: Date
  updatedAt: Date
}

```

Key routes

```
GET    /auth/google
GET    /auth/google/callback
GET    /auth/me

POST   /files/upload-url        -> returns presigned upload URL from S3
POST   /files/confirm-upload    -> insert metadata after upload

GET    /files                   -> list files, search via ?search=
PUT    /files/:id               -> rename
DELETE /files/:id               -> remove from S3 and DB

POST /files/:id/share
body: { userId, level }  // "read" or "write"
POST   /files/:id/public        -> mark as public
POST   /files/:id/private       -> mark as private

GET    /files/:id/download      -> if access allowed, return presigned download URL

```

Access control

```
owner always allowed
public flag allows anyone with link
sharedWith allows those specific users
otherwise 403

```

File size limits strategy
* Client side size check to reject early
* Multer or busboy limit on backend to kill large requests
* S3 presigned URL with content length range so even bypassing the backend fails
Deployment
* Backend on Render or Railway
* Frontend on Vercel
* S3 real bucket with IAM user and least privilege policy
* Dockerfile for backend to show you care about deployability
What makes this stand out
* Presigned upload and download pattern shows you actually understand file handling
* Access control is correctly scoped instead of naive public links
* Indexed search prevents full collection scans
* Rate limiting proves security awareness
