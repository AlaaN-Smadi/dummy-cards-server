# Card Management Server

A Node.js server with three API routes for card management.

## Installation

```bash
npm install
```

## Running the Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

Server runs on `http://localhost:3000`

## API Routes

### 1. Create Card - POST /create-card
Creates a new card with sample data.

**Request Body:**
```json
{
  "userName": "John Doe"
}
```

**Response:**
```json
{
  "success": true,
  "cardNumber": "1234567890",
  "card": { /* card object */ }
}
```

### 2. Get Card - POST /api/cards/{cardNumber}/details
Retrieves card data by card number. Creates new card if it doesn't exist.

**Response:**
```json
{
  "success": true,
  "card": { /* card object */ }
}
```

### 3. Refresh Card - GET /refresh-card/{cardNumber}
Refreshes card data (simulates balance update).

**Response:**
```json
{
  "success": true,
  "message": "Card data refreshed",
  "card": { /* updated card object */ }
}
```

## Testing

Use tools like Postman or curl to test the endpoints.