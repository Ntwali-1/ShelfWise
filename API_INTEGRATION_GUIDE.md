# ShelfWise Backend API Integration Guide

## 🚀 Quick Start

### Environment Setup

1. Copy `.env.example` to `.env`
2. Configure the following variables:

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

3. Run migrations: `npx prisma migrate dev`
4. Start server: `npm run start:dev`

## 🔐 Authentication

### Clerk Integration

The backend now supports Clerk JWT authentication. All protected endpoints require a Bearer token from Clerk.

**How it works:**
1. User authenticates via Clerk on frontend
2. Frontend receives Clerk JWT token
3. Frontend includes token in Authorization header: `Bearer <token>`
4. Backend validates token and syncs user to database
5. User is automatically created on first request if doesn't exist

**Auth Guards:**
- `@UseGuards(AuthGuard('clerk'))` - Requires valid Clerk JWT
- `@UseGuards(AuthGuard('jwt'))` - Legacy JWT auth (for backward compatibility)

**Role-Based Access:**
- `@Roles(Role.Admin)` - Admin only
- `@Roles(Role.Client)` - Customer only

## 📡 API Endpoints

Base URL: `http://localhost:3000`

### Public Endpoints (No Auth Required)

#### Products
- `GET /products` - Get all products with filters
  - Query params: `category`, `search`, `page`, `limit`, `minPrice`, `maxPrice`
- `GET /products/search?q=query` - Search products
- `GET /products/:id` - Get product by ID

#### Categories
- `GET /categories` - Get all categories
- `GET /categories/:name/products` - Get products by category

#### Reviews
- `GET /reviews/products/:productId` - Get product reviews

---

### Customer Endpoints (Requires Auth)

#### Cart
- `POST /cart/items` - Add item to cart
  ```json
  { "productId": "string", "quantity": number }
  ```
- `GET /cart` - Get user's cart
- `DELETE /cart/items/:itemId` - Remove item from cart
- `DELETE /cart` - Clear entire cart

#### Wishlist
- `POST /wishlist` - Add to wishlist
  ```json
  { "productId": "string" }
  ```
- `GET /wishlist` - Get user's wishlist
- `DELETE /wishlist/:productId` - Remove from wishlist

#### Orders
- `POST /orders` - Create order
  ```json
  {
    "address": "string",
    "items": [{ "productId": "string", "quantity": number }]
  }
  ```
- `GET /orders` - Get my orders
- `GET /orders/:id` - Get order details

#### Reviews
- `POST /reviews/products/:productId` - Create review
  ```json
  { "rating": number, "comment": "string" }
  ```
- `PUT /reviews/:reviewId` - Update review
- `DELETE /reviews/:reviewId` - Delete review

#### Profile
- `POST /profile` - Create profile
  ```json
  {
    "firstName": "string",
    "lastName": "string",
    "birthday": "date",
    "bio": "string",
    "address": "string",
    "phoneNumber": "string"
  }
  ```
- `GET /profile` - Get my profile
- `PUT /profile` - Update profile
- `POST /profile/avatar` - Update avatar
  ```json
  { "avatarUrl": "string" }
  ```

---

### Admin Endpoints (Requires Admin Role)

#### Products Management
- `POST /products` - Create product
  ```json
  {
    "name": "string",
    "description": "string",
    "price": number,
    "quantity": number,
    "sku": "string",
    "categoryId": number,
    "imageUrl": "string"
  }
  ```
- `PUT /products/:id` - Update product
- `PATCH /products/:id/stock` - Update stock
  ```json
  { "quantity": number }
  ```
- `DELETE /products/:id` - Delete product

#### Categories Management
- `POST /categories` - Create category
  ```json
  { "name": "string" }
  ```
- `DELETE /categories/:id` - Delete category

#### Orders Management
- `GET /orders/admin/all?status=pending` - Get all orders (with optional status filter)
- `PUT /orders/:id/status` - Update order status
  ```json
  { "status": "pending|processing|shipped|delivered|cancelled" }
  ```
- `GET /orders/admin/statistics` - Get order statistics

---

## 🔄 Migration from Old Endpoints

### Changed Endpoints

| Old Endpoint | New Endpoint | Method | Notes |
|-------------|--------------|--------|-------|
| `/cart/add` | `/cart/items` | POST | Aligned with REST conventions |
| `/cart/:itemId` | `/cart/items/:itemId` | DELETE | Added `/items` path |
| `/wishlist/add/:productId` | `/wishlist` | POST | Body: `{ "productId": "..." }` |
| `/orders/create` | `/orders` | POST | Simplified path |
| `/orders/my-orders` | `/orders` | GET | Simplified path |
| `/orders/all` | `/orders/admin/all` | GET | Clarified admin route |
| `/orders/statistics/overview` | `/orders/admin/statistics` | GET | Clarified admin route |
| `/profile/create` | `/profile` | POST | Simplified path |
| `/profile/me` | `/profile` | GET | Simplified path |
| `/products/:id` | `/products/:id` | PATCH → PUT | Changed to PUT for updates |

### Auth Guard Changes

All `AuthGuard('jwt')` changed to `AuthGuard('clerk')` for Clerk integration.

---

## 🎯 Frontend Integration Checklist

### 1. Install Clerk
```bash
npm install @clerk/nextjs
```

### 2. Configure Clerk in Frontend
Add to `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key
CLERK_SECRET_KEY=your_secret
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Update API Client
```typescript
import { useAuth } from '@clerk/nextjs';

const { getToken } = useAuth();
const token = await getToken();

fetch(`${API_URL}/endpoint`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

### 4. Update API Endpoints in Frontend
Update `Frontend/lib/api.ts` to match new backend endpoints (see migration table above).

---

## 🛠️ Development Tips

### Testing with Swagger
Visit `http://localhost:3000/api` for interactive API documentation.

### Creating First Admin User
1. Sign up via Clerk
2. Manually update user role in database:
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'admin@example.com';
```

### WebSocket Support
Backend includes WebSocket gateway for real-time updates (product inventory changes).

---

## 🐛 Troubleshooting

### CORS Issues
- Ensure `FRONTEND_URL` in `.env` matches your frontend URL
- Check browser console for specific CORS errors

### Auth Issues
- Verify Clerk keys are correct
- Check token is being sent in Authorization header
- Ensure user exists in database (auto-created on first request)

### Database Issues
- Run `npx prisma migrate reset` to reset database
- Run `npx prisma studio` to inspect database

---

## 📚 Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [NestJS Documentation](https://docs.nestjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
