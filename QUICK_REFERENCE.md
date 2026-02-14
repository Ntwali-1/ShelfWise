# ShelfWise API Quick Reference

## 🔗 Base URL
```
http://localhost:3000
```

## 🔑 Authentication Header
```
Authorization: Bearer <clerk_jwt_token>
```

---

## 📦 Products

### Public
```http
GET    /products                    # List all (query: category, search, page, limit)
GET    /products/search?q=query     # Search products
GET    /products/:id                # Get by ID
```

### Admin Only
```http
POST   /products                    # Create
PUT    /products/:id                # Update
PATCH  /products/:id/stock          # Update stock
DELETE /products/:id                # Delete
```

---

## 🏷️ Categories

### Public
```http
GET    /categories                  # List all
GET    /categories/:name/products   # Get products by category
```

### Admin Only
```http
POST   /categories                  # Create
DELETE /categories/:id              # Delete
```

---

## 🛒 Cart (Auth Required)

```http
POST   /cart/items                  # Add item { productId, quantity }
GET    /cart                        # Get cart
DELETE /cart/items/:itemId          # Remove item
DELETE /cart                        # Clear cart
```

---

## ❤️ Wishlist (Auth Required)

```http
POST   /wishlist                    # Add { productId }
GET    /wishlist                    # Get wishlist
DELETE /wishlist/:productId         # Remove
```

---

## 📦 Orders

### Customer
```http
POST   /orders                      # Create { address, items[] }
GET    /orders                      # My orders
GET    /orders/:id                  # Order details
```

### Admin
```http
GET    /orders/admin/all            # All orders (query: status)
PUT    /orders/:id/status           # Update status { status }
GET    /orders/admin/statistics     # Statistics
```

---

## ⭐ Reviews

### Public
```http
GET    /reviews/products/:productId # Get reviews
```

### Auth Required
```http
POST   /reviews/products/:productId # Create { rating, comment }
PUT    /reviews/:reviewId           # Update { rating, comment }
DELETE /reviews/:reviewId           # Delete
```

---

## 👤 Profile (Auth Required)

```http
POST   /profile                     # Create profile
GET    /profile                     # Get profile
PUT    /profile                     # Update profile
POST   /profile/avatar              # Update avatar { avatarUrl }
```

---

## 🎭 Roles

- `client` - Default role for customers
- `admin` - Admin role (set manually in DB)

---

## 📊 Order Status Values

- `pending`
- `processing`
- `shipped`
- `delivered`
- `cancelled`

---

## 🔧 Common Request Examples

### Add to Cart
```json
POST /cart/items
{
  "productId": "prod_123",
  "quantity": 2
}
```

### Create Order
```json
POST /orders
{
  "address": "123 Main St, City, State 12345",
  "items": [
    { "productId": "prod_123", "quantity": 2 },
    { "productId": "prod_456", "quantity": 1 }
  ]
}
```

### Create Product (Admin)
```json
POST /products
{
  "name": "Product Name",
  "description": "Product description",
  "price": 29.99,
  "quantity": 100,
  "sku": "SKU-001",
  "categoryId": 1,
  "imageUrl": "https://example.com/image.jpg"
}
```

### Create Review
```json
POST /reviews/products/prod_123
{
  "rating": 5,
  "comment": "Great product!"
}
```

---

## 🚨 Error Responses

```json
{
  "statusCode": 400,
  "message": "Error message",
  "error": "Bad Request"
}
```

Common Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

---

## 🔍 Query Parameters

### Products
- `category` - Filter by category name
- `search` - Search in name/description
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `minPrice` - Minimum price
- `maxPrice` - Maximum price

### Orders (Admin)
- `status` - Filter by order status

---

## 📚 Documentation

- Swagger UI: `http://localhost:3000/api`
- Full Guide: `API_INTEGRATION_GUIDE.md`
- Changes: `CHANGELOG_INTEGRATION.md`
