# ShelfWise Backend

E-commerce backend API built with NestJS, Prisma, and PostgreSQL with Clerk authentication.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Clerk account (for authentication)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
PORT=3000
JWTSECRETKEY="your-jwt-secret-key"
EMAILUSER="your-email@gmail.com"
EMAILPASS="your-gmail-app-password"
NODE_ENV="development"

# Clerk Configuration
CLERK_SECRET_KEY="your-clerk-secret-key"
CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"

# Frontend URL for CORS
FRONTEND_URL="http://localhost:3001"
```

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Generate Prisma Client:
```bash
npx prisma generate
```

5. Start the development server:
```bash
npm run start:dev
```

The API will be available at `http://localhost:3000`

## 📚 Documentation

- **API Documentation**: `http://localhost:3000/api` (Swagger UI)
- **Integration Guide**: [API_INTEGRATION_GUIDE.md](./API_INTEGRATION_GUIDE.md)
- **Quick Reference**: [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
- **Changelog**: [CHANGELOG_INTEGRATION.md](./CHANGELOG_INTEGRATION.md)

## 🔑 Authentication

This API uses Clerk for authentication. All protected endpoints require a valid Clerk JWT token in the Authorization header:

```
Authorizat