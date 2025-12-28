# VaultQ Frontend

A Google Drive clone frontend built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Google OAuth authentication
- File upload with progress tracking
- File management (rename, delete, download)
- File sharing with permissions
- Search functionality
- Responsive design (mobile-friendly)
- Dark theme matching Google Drive

## Prerequisites

- Node.js 18+
- Backend API running (see backend README)

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Development

```bash
npm run dev
```

The frontend will run on http://localhost:3001

## Build

```bash
npm run build
```

## Production

```bash
npm start
```

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Home/My Drive page
│   ├── drive/             # My Drive page
│   ├── shared/            # Shared files page
│   ├── recent/            # Recent files page
│   └── auth/              # Auth pages
├── components/
│   ├── layout/            # Layout components (Sidebar, TopBar, FileGrid)
│   ├── files/             # File-related components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api.ts             # API client
│   └── utils.ts           # Utility functions
├── hooks/                 # Custom React hooks
├── contexts/              # React contexts
└── types/                 # TypeScript types
```

## Features

### Authentication
- Google OAuth integration
- Session-based authentication
- Protected routes

### File Operations
- Upload files (max 100MB)
- Rename files
- Delete files
- Download files
- Search files

### Sharing
- Share files with specific users
- Set permissions (read/write)
- Make files public/private

### UI/UX
- Google Drive-like interface
- Dark theme
- Responsive design
- Context menus
- Loading states
- Error handling

## Notes

- The backend must be configured to redirect OAuth callbacks to the frontend URL
- Ensure CORS is properly configured on the backend
- Session cookies are used for authentication
