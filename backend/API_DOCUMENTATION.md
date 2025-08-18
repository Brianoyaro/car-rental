# Car Rental API - Booking System Documentation

## Overview

This is the backend API for the Car Rental Booking System, focusing on comprehensive booking management with secure authentication, data validation, and business logic.

## Base URL

```text
http://localhost:3000/api
```

## Authentication

Most endpoints require JWT authentication. Include the token in the Authorization header:

```text
Authorization: Bearer <your-jwt-token>
```

## Booking Endpoints

### 1. Create Booking

**POST** `/bookings`

Creates a new car rental booking.

**Authentication**: Required (Customer or Admin)

**Request Body**:

```json
{
  "carId": 1,
  "startDate": "2025-08-20",
  "endDate": "2025-08-25"
}
```

**Response** (201 Created):

```json
{
  "message": "Booking created successfully",
  "booking": {
    "id": 1,
    "userId": 2,
    "carId": 1,
    "startDate": "2025-08-20",
    "endDate": "2025-08-25",
    "totalPrice": "15000.00",
    "status": "pending",
    "createdAt": "2025-08-17T10:00:00.000Z",
    "car": {
      "id": 1,
      "make": "Toyota",
      "model": "Corolla",
      "licensePlate": "KAA 001A",
      "pricePerDay": "3000.00",
      "imageUrl": "https://example.com/toyota-corolla.jpg"
    },
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+254700000001"
    }
  }
}
```

**Business Logic**:

- Validates car availability for selected dates
- Calculates total price automatically
- Sets initial status to 'pending'
- Checks for overlapping bookings

### 2. List Bookings

**GET** `/bookings`

Lists bookings based on user role and filters.

**Authentication**: Required

**Query Parameters**:

- `status`: Filter by booking status (pending, approved, rejected, active, completed, cancelled)
- `startDate`: Filter by start date (YYYY-MM-DD)
- `endDate`: Filter by end date (YYYY-MM-DD)
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)

**Response** (200 OK):

```json
{
  "bookings": [
    {
      "id": 1,
      "userId": 2,
      "carId": 1,
      "startDate": "2025-08-20",
      "endDate": "2025-08-25",
      "totalPrice": "15000.00",
      "status": "pending",
      "createdAt": "2025-08-17T10:00:00.000Z",
      "car": {
        "id": 1,
        "make": "Toyota",
        "model": "Corolla",
        "licensePlate": "KAA 001A",
        "pricePerDay": "3000.00",
        "imageUrl": "https://example.com/toyota-corolla.jpg"
      },
      "user": {
        "id": 2,
        "name": "John Doe",
        "email": "john@example.com",
        "phoneNumber": "+254700000001"
      },
      "payments": [
        {
          "id": 1,
          "status": "pending",
          "paymentMethod": "mpesa",
          "amount": "15000.00"
        }
      ]
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalBookings": 1,
    "hasNextPage": false,
    "hasPrevPage": false,
    "limit": 10
  }
}
```

**Role-based Access**:

- **Customers**: See only their own bookings
- **Admins**: See all bookings

### 3. Get Booking Details

**GET** `/bookings/:id`

Retrieves detailed information about a specific booking.

**Authentication**: Required (Admin or Booking Owner)

**Response** (200 OK):

```json
{
  "booking": {
    "id": 1,
    "userId": 2,
    "carId": 1,
    "startDate": "2025-08-20",
    "endDate": "2025-08-25",
    "totalPrice": "15000.00",
    "status": "approved",
    "createdAt": "2025-08-17T10:00:00.000Z",
    "car": {
      "id": 1,
      "make": "Toyota",
      "model": "Corolla",
      "licensePlate": "KAA 001A",
      "pricePerDay": "3000.00",
      "imageUrl": "https://example.com/toyota-corolla.jpg",
      "status": "rented"
    },
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+254700000001",
      "idNumber": "ID123456"
    },
    "payments": [
      {
        "id": 1,
        "status": "completed",
        "paymentMethod": "mpesa",
        "amount": "15000.00",
        "transactionId": "MPESA123456789",
        "createdAt": "2025-08-17T11:00:00.000Z"
      }
    ]
  }
}
```

### 4. Update Booking

**PUT** `/bookings/:id`

Updates booking details such as dates, status, or extends rental period.

**Authentication**: Required (Admin or Booking Owner)

**Request Body** (all fields optional):

```json
{
  "startDate": "2025-08-21",
  "endDate": "2025-08-26",
  "status": "approved"
}
```

**Response** (200 OK):

```json
{
  "message": "Booking updated successfully",
  "booking": {
    "id": 1,
    "userId": 2,
    "carId": 1,
    "startDate": "2025-08-21",
    "endDate": "2025-08-26",
    "totalPrice": "15000.00",
    "status": "approved",
    "createdAt": "2025-08-17T10:00:00.000Z",
    "car": {
      "id": 1,
      "make": "Toyota",
      "model": "Corolla",
      "licensePlate": "KAA 001A",
      "pricePerDay": "3000.00",
      "imageUrl": "https://example.com/toyota-corolla.jpg",
      "status": "rented"
    },
    "user": {
      "id": 2,
      "name": "John Doe",
      "email": "john@example.com",
      "phoneNumber": "+254700000001"
    },
    "payments": []
  }
}
```

**Business Logic**:

- Re-validates car availability for new dates
- Recalculates total price automatically
- Updates car status based on booking status
- Customers can only cancel their bookings
- Admins can update any booking status

**Status Transitions**:

- `approved` → Car status becomes 'rented'
- `cancelled/completed/rejected` → Car status becomes 'available'

### 5. Cancel Booking

**DELETE** `/bookings/:id`

Cancels a booking and handles refund processing.

**Authentication**: Required (Admin or Booking Owner)

**Response** (200 OK):

```json
{
  "message": "Booking cancelled successfully",
  "booking": {
    "id": 1,
    "userId": 2,
    "carId": 1,
    "startDate": "2025-08-20",
    "endDate": "2025-08-25",
    "totalPrice": "15000.00",
    "status": "cancelled",
    "createdAt": "2025-08-17T10:00:00.000Z",
    "car": {
      "id": 1,
      "make": "Toyota",
      "model": "Corolla",
      "licensePlate": "KAA 001A",
      "status": "available"
    },
    "payments": [
      {
        "id": 1,
        "status": "refunded",
        "paymentMethod": "mpesa",
        "amount": "15000.00"
      }
    ]
  },
  "refundsProcessed": true
}
```

**Business Logic**:

- Updates booking status to 'cancelled'
- Sets car status back to 'available'
- Processes refunds for completed payments
- Cannot cancel already completed bookings

### 6. Check Car Availability

**GET** `/bookings/:carId/availability`

Checks if a car is available for specific dates.

**Query Parameters**:

- `startDate`: Start date (YYYY-MM-DD) - Required
- `endDate`: End date (YYYY-MM-DD) - Required

**Response** (200 OK):

```json
{
  "carId": 1,
  "startDate": "2025-08-20",
  "endDate": "2025-08-25",
  "available": true,
  "car": {
    "id": 1,
    "make": "Toyota",
    "model": "Corolla",
    "pricePerDay": "3000.00",
    "status": "available"
  }
}
```

## Authentication Endpoints

### Register User

**POST** `/auth/register`

### Login

**POST** `/auth/login`

### Get Current User

**GET** `/auth/me`

### Logout

**POST** `/auth/logout`

## Error Responses

### 400 Bad Request

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "startDate",
      "message": "Start date must be today or in the future"
    }
  ]
}
```

### 401 Unauthorized

```json
{
  "error": "Access token required"
}
```

### 403 Forbidden

```json
{
  "error": "Customers can only cancel their bookings"
}
```

### 404 Not Found

```json
{
  "error": "Booking not found"
}
```

### 409 Conflict

```json
{
  "error": "Car is not available for the selected dates",
  "message": "Please choose different dates or another car"
}
```

### 500 Internal Server Error

```json
{
  "error": "Failed to create booking",
  "details": "Database connection error"
}
```

## Business Rules

### Booking Creation

1. Car must exist and be available
2. Start date must be today or in the future
3. End date must be after start date
4. Maximum rental period: 365 days
5. No overlapping bookings for the same car
6. Total price calculated as: (days) × (pricePerDay)

### Booking Updates

1. Cannot modify completed or cancelled bookings
2. Date changes require availability re-validation
3. Price recalculation for date changes
4. Status changes affect car availability

### Cancellation Rules

1. Cannot cancel completed bookings
2. Refunds processed for completed payments
3. Car becomes available immediately

### Security Features

1. JWT-based authentication
2. Role-based access control
3. Input validation and sanitization
4. Rate limiting (100 requests per 15 minutes)
5. CORS protection
6. Password hashing with bcrypt

## Database Schema

### Bookings Table

```sql
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  car_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  status ENUM('pending', 'approved', 'rejected', 'active', 'completed', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (car_id) REFERENCES cars(id)
);
```

This documentation covers the complete booking system implementation with all the requested features including security, validation, business logic, and integration points.
