# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Receipt Scanner (家計簿くん) is a household expense tracking application that creates budgets from receipt images and manages monthly expenses. Built with Next.js, TypeScript, Prisma, and NextAuth for Google OAuth authentication.

## Development Commands

```bash
# Development server
npm run dev

# Build the application
npm run build

# Start production build
npm run start

# Linting
npm run lint

# Database operations
npx prisma db push          # Apply schema changes without migrations
npx prisma db seed          # Seed database with dummy data
npx prisma studio          # Open Prisma Studio for database inspection

# Docker (PostgreSQL only)
docker-compose -f docker/dev/compose.yml up
```

## Architecture Overview

### Database Schema (Prisma)
- **User**: OAuth users with Google authentication
- **Expense**: Individual expense records linked to users and categories
- **Category**: Predefined expense categories (食費, 交通費, etc.)
- **Budget**: Monthly budget allocations per category per user
- **Receipt**: Image metadata for receipt processing
- **Account**: NextAuth OAuth account relationships

### Key Directories Structure
```
src/
├── app/                    # Next.js App Router pages and API routes
│   ├── _actions/          # Server Actions for database operations
│   ├── api/auth/          # NextAuth API routes
│   └── {page}/            # Application pages (dashboard, expenses, budgets)
├── _components/
│   ├── common/            # Reusable UI components (charts, dialogs)
│   ├── features/          # Page-specific components organized by feature
│   └── layouts/           # Layout components (Header, Sidebar)
├── lib/
│   ├── db/               # Database layer - Prisma client operations organized by model
│   ├── auth.config.ts    # NextAuth configuration
│   ├── prisma.ts         # Prisma client instance
│   └── s3.ts             # AWS S3 client for receipt image storage
├── types/                # TypeScript type definitions
└── utils/                # Utility functions (financial calculations, time handling)
```

### Authentication Flow
- Uses NextAuth v5 with Google OAuth provider
- JWT session strategy with custom callbacks for user creation
- Redirects to `/signin` for unauthenticated users
- User accounts automatically created on first login

### Data Flow Pattern
- **Server Components** fetch data using functions from `lib/db/`
- **Server Actions** in `app/_actions/` handle form submissions and mutations
- **Client Components** use Server Actions for interactivity
- Database operations abstracted through model-specific files in `lib/db/`

### External Integrations
- **AWS S3**: Receipt image storage using presigned URLs
- **Python Receipt Scanner API**: External service for receipt text extraction (PYTHON_API_SERVER env var)
- **Material-UI**: Component library for UI elements
- **Day.js**: Date manipulation and formatting

## Key Technologies
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type safety throughout the application
- **Prisma**: Database ORM with PostgreSQL
- **NextAuth v5**: Authentication with Google OAuth
- **Material-UI**: UI component library
- **AWS SDK**: S3 integration for file storage

## Environment Variables Required
```
DATABASE_URL=postgresql://...
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
AUTH_SECRET=
NEXTAUTH_URL=
PYTHON_API_SERVER=
```

## Receipt Processing Workflow
1. User uploads receipt image via `ReceiptUpload` component
2. Image stored in S3 bucket with presigned URL
3. External Python API processes receipt text extraction
4. Parsed expense data populates expense creation form
5. User confirms/edits expense details before saving

## Database Seeding
- Run with `NODE_ENV=development` to include budget seeding
- Creates sample categories, expenses, and budgets for development
- Uses Faker.js for generating realistic dummy data