# API Implementation Documentation

This document describes the API endpoints that have been implemented for the betting site frontend application.

## Base URL
All API endpoints are prefixed with `/api/v1/`

## Authentication
The API uses Laravel Sanctum for authentication with JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer {token}
```

## Response Format
All API responses follow this standard format:
```json
{
  "success": true|false,
  "data": {...},
  "message": "Response message",
  "error": null|{...},
  "timestamp": "2024-01-01T00:00:00.000000Z"
}
```

## Rate Limiting
- Authentication endpoints: 5 requests per minute per IP
- Payment endpoints: 10 requests per minute per user
- Game launch: 20 requests per minute per user
- General API endpoints: 100 requests per minute per user

## Endpoints

### Authentication Endpoints

#### POST /api/v1/auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "nickname": "username",
  "agreeTerms": true,
  "agreeMarketing": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "customer_id",
      "email": "user@example.com",
      "nickname": "username",
      "balance": 200,
      "level": 1,
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000000Z"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  },
  "message": "Registration successful"
}
```

#### POST /api/v1/auth/register/quick
Quick registration (1-click registration).

**Request Body:**
```json
{
  "agreeTerms": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "customer_id",
      "email": "generated@qizilkazino.com",
      "nickname": "generated_username",
      "balance": 0,
      "level": 1,
      "isVerified": false,
      "createdAt": "2024-01-01T00:00:00.000000Z"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here",
    "credentials": {
      "email": "generated@qizilkazino.com",
      "password": "generated_password"
    }
  },
  "message": "Quick registration successful"
}
```

#### POST /api/v1/auth/login
User login.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "customer_id",
      "email": "user@example.com",
      "nickname": "username",
      "balance": 1500.50,
      "level": 1,
      "isVerified": false,
      "lastLoginAt": "2024-01-01T00:00:00.000000Z"
    },
    "token": "jwt_token_here",
    "refreshToken": "refresh_token_here"
  },
  "message": "Login successful"
}
```

#### POST /api/v1/auth/refresh
Refresh authentication token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token_here"
}
```

#### POST /api/v1/auth/logout
Logout user (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": null,
  "message": "Logout successful"
}
```

#### POST /api/v1/auth/password-reset
Request password reset (placeholder - not implemented).

#### POST /api/v1/auth/password-reset/confirm
Confirm password reset (placeholder - not implemented).

### User Management Endpoints

#### GET /api/v1/users/profile
Get user profile information (requires authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "customer_id",
    "email": "user@example.com",
    "nickname": "username",
    "balance": 1500.50,
    "level": 1,
    "totalDeposits": 2000.00,
    "totalWithdrawals": 500.00,
    "totalWinnings": 750.00,
    "gamesPlayed": 25,
    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000000Z",
    "lastLoginAt": "2024-01-01T12:00:00.000000Z"
  }
}
```

#### PUT /api/v1/users/profile
Update user profile (requires authentication).
*Note: Limited functionality due to existing database schema*

#### PUT /api/v1/users/password
Change user password (requires authentication).

**Request Body:**
```json
{
  "currentPassword": "old_password",
  "newPassword": "new_password"
}
```

#### GET /api/v1/users/balance
Get user balance information (requires authentication).

**Response (Single Wallet):**
```json
{
  "success": true,
  "data": {
    "wallet": "chcblack",
    "balance": 1500.50,
    "currency": "AZN",
    "lastUpdated": "2024-01-01T00:00:00.000000Z"
  }
}
```

**Response (Multiple Wallets):**
```json
{
  "success": true,
  "data": {
    "wallets": [
      {
        "wallet": "chcblack",
        "balance": 1500.50,
        "currency": "AZN",
        "lastUpdated": "2024-01-01T00:00:00.000000Z"
      },
      {
        "wallet": "brombet",
        "balance": 750.25,
        "currency": "AZN",
        "lastUpdated": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "totalBalance": 2250.75,
    "currency": "AZN",
    "lastUpdated": "2024-01-01T00:00:00.000000Z"
  }
}
```

#### GET /api/v1/users/statistics
Get user statistics (requires authentication).

### Payment Endpoints

#### POST /api/v1/payments/deposit
Create a deposit (requires authentication).

**Request Body:**
```json
{
  "amount": 100.00,
  "paymentMethod": "visa",
  "cardNumber": "4111111111111111",
  "expiryDate": "12/25",
  "cvv": "123",
  "saveCard": false,
  "wallet": "chcblack"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "transactionId": "order_number",
    "amount": 100.00,
    "currency": "AZN",
    "paymentMethod": "visa",
    "status": "pending",
    "paymentUrl": "https://example.com/payment/url",
    "wallet": "chcblack",
    "createdAt": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Deposit created successfully"
}
```

#### POST /api/v1/payments/withdraw
Create a withdrawal (requires authentication).

**Request Body:**
```json
{
  "amount": 50.00,
  "paymentMethod": "visa",
  "cardNumber": "4111111111111111",
  "accountHolder": "John Doe",
  "wallet": "chcblack"
}
```

#### GET /api/v1/payments/history
Get payment history (requires authentication).

**Query Parameters:**
- `page` (optional): Page number
- `limit` (optional): Items per page (max 100)
- `type` (optional): `deposit` or `withdrawal`
- `status` (optional): `pending`, `completed`, or `failed`

#### GET /api/v1/payments/cards
Get saved cards (requires authentication, placeholder).

#### DELETE /api/v1/payments/cards/{cardId}
Delete saved card (requires authentication, placeholder).

### Games Endpoints

#### GET /api/v1/games
Get all games with filtering and pagination.

**Query Parameters:**
- `category` (optional): `slots`, `table`, `live`, `jackpot`, `new`
- `provider` (optional): Game provider name
- `featured` (optional): Boolean for featured games
- `search` (optional): Search term
- `page` (optional): Page number
- `limit` (optional): Items per page (max 100)

**Response:**
```json
{
  "success": true,
  "data": {
    "data": [
      {
        "id": "encoded_game_id",
        "name": "Game Name",
        "category": "slots",
        "provider": "Unknown",
        "image": "https://example.com/game-image.jpg",
        "featured": false,
        "jackpot": null,
        "rtp": 96.0,
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 100,
      "totalPages": 2
    }
  }
}
```

#### GET /api/v1/games/featured
Get featured games.

#### GET /api/v1/games/popular
Get popular games.

#### GET /api/v1/games/categories
Get game categories.

#### GET /api/v1/games/{gameId}
Get game details.

#### POST /api/v1/games/{gameId}/launch
Launch game (requires authentication).

**Request Body:**
```json
{
  "mode": "real"
}
```

### System Endpoints

#### GET /api/v1/winners/recent
Get recent winners.

**Query Parameters:**
- `limit` (optional): Number of winners to return (max 50)

#### GET /api/v1/jackpots
Get jackpot information (placeholder - returns empty array).

#### GET /api/v1/config
Get system configuration.

**Response:**
```json
{
  "success": true,
  "data": {
    "currencies": ["AZN"],
    "languages": ["az", "en"],
    "paymentMethods": [...],
    "gameCategories": [...],
    "maintenance": {
      "isActive": false,
      "message": null,
      "estimatedEnd": null
    },
    "wallets": ["chcblack", "brombet"],
    "features": {
      "brombetWalletEnabled": true,
      "aviatorEnabled": true,
      "xliveEnabled": true
    }
  }
}
```

#### GET /api/v1/health
Health check endpoint.

### Bonuses Endpoints (Placeholders)

#### GET /api/v1/bonuses
Get available bonuses (requires authentication).

#### POST /api/v1/bonuses/{bonusId}/claim
Claim bonus (requires authentication).

#### GET /api/v1/bonuses/history
Get bonus history (requires authentication).

### Support Endpoints (Placeholders)

#### POST /api/v1/support/tickets
Create support ticket (requires authentication).

#### GET /api/v1/support/tickets
Get support tickets (requires authentication).

#### POST /api/v1/support/tickets/{ticketId}/messages
Add message to support ticket (requires authentication).

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "data": null,
  "message": "Validation failed",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": {
      "email": ["The email field is required."]
    }
  }
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "data": null,
  "message": "Authentication failed",
  "error": {
    "code": "AUTHENTICATION_FAILED",
    "message": "Authentication failed"
  }
}
```

### Rate Limit Error (429)
```json
{
  "success": false,
  "data": null,
  "message": "Too many requests",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests"
  }
}
```

## Multi-Wallet Support

The API supports multiple wallets (chcblack and brombet) based on domain configuration:

- **chcblack**: Default wallet, always available
- **brombet**: Available when enabled in domain settings

When multiple wallets are available, users can specify which wallet to use in payment operations using the `wallet` parameter.

## Security Features

- Rate limiting per endpoint type
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- JWT token authentication
- Request validation
- Error handling with appropriate HTTP status codes

## Notes

- Some endpoints are marked as placeholders and need full implementation based on business requirements
- The API follows existing database schema and doesn't add new fields
- Multi-wallet functionality is integrated based on existing wallet system
- All endpoints return consistent JSON response format
- Authentication uses Laravel Sanctum with JWT tokens
