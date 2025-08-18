# Car Rental Booking System - Backend

A secure, scalable backend API for a car rental booking system built with Node.js, Express, Sequelize, and MySQL. This implementation focuses on the **booking branch** with comprehensive booking management features.

## 🚀 Features

### Core Booking System
- **Create Bookings**: Customers can book available cars for specific date ranges
- **Booking Management**: View, update, and cancel bookings with proper authorization
- **Availability Checking**: Real-time car availability validation
- **Price Calculation**: Automatic total price calculation based on rental duration
- **Status Management**: Complete booking lifecycle (pending → approved → active → completed)

### Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Customer and Admin roles with appropriate permissions
- **Input Validation**: Comprehensive validation using express-validator
- **Rate Limiting**: Protection against abuse (100 requests per 15 minutes)
- **Password Hashing**: Secure bcrypt password hashing

### Database & Models
- **Robust Schema**: Well-designed database with proper relationships
- **Data Integrity**: Foreign key constraints and validation
- **Soft Validation**: Business rule enforcement at application level
- **Associations**: Proper model relationships between Users, Cars, Bookings, and Payments

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-rental/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your database credentials:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=car_rental
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=24h
   PORT=3000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

4. **Create MySQL database**
   ```sql
   CREATE DATABASE car_rental;
   ```

5. **Setup database and seed data**
   ```bash
   npm run setup-db
   ```

6. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/logout` - Logout

### Bookings (Core Focus)
- `POST /api/bookings` - Create new booking ✨
- `GET /api/bookings` - List bookings (with filters) ✨
- `GET /api/bookings/:id` - Get booking details ✨
- `PUT /api/bookings/:id` - Update booking ✨
- `DELETE /api/bookings/:id` - Cancel booking ✨
- `GET /api/bookings/:carId/availability` - Check car availability ✨

### Cars
- `GET /api/cars` - List available cars
- `GET /api/cars/:id` - Get car details
- `POST /api/cars` - Add new car (Admin only)

### Users
- `GET /api/users` - List all users (Admin only)
- `GET /api/users/:id` - Get user profile

### Payments
- `POST /api/payments` - Create payment for booking
- `GET /api/payments/:id` - Get payment details

## 🎯 Business Logic

### Booking Creation Process
1. **Validation**: Validate car exists and dates are valid
2. **Availability Check**: Ensure no overlapping bookings
3. **Price Calculation**: Calculate total price automatically
4. **Status Setting**: Initialize as 'pending' status
5. **Response**: Return complete booking with associations

### Booking Updates
1. **Permission Check**: Verify user can modify booking
2. **Date Validation**: Re-check availability for new dates
3. **Price Recalculation**: Update total price if dates change
4. **Status Management**: Update car status based on booking status
5. **Constraints**: Prevent modification of completed/cancelled bookings

### Cancellation Process
1. **Authorization**: Verify user owns booking or is admin
2. **Status Update**: Mark booking as cancelled
3. **Car Release**: Set car status back to available
4. **Refund Processing**: Handle payment refunds automatically

## 🔒 Security Features

- **JWT Authentication**: Stateless token-based auth
- **Password Security**: bcrypt hashing with salt rounds
- **Input Sanitization**: SQL injection prevention
- **Rate Limiting**: Request throttling
- **CORS Protection**: Cross-origin request control
- **Role Authorization**: Granular permission system

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  role ENUM('customer', 'admin') DEFAULT 'customer',
  id_number VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Cars table
CREATE TABLE cars (
  id INT PRIMARY KEY AUTO_INCREMENT,
  make VARCHAR(50) NOT NULL,
  model VARCHAR(50) NOT NULL,
  manufacture_year INT NOT NULL,
  license_plate VARCHAR(20) UNIQUE NOT NULL,
  price_per_day DECIMAL(10,2) NOT NULL,
  status ENUM('available', 'rented', 'maintenance') DEFAULT 'available',
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table (CORE FOCUS)
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

-- Payments table
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  booking_id INT NOT NULL,
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_method ENUM('mpesa', 'card', 'bank_transfer') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  transaction_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

## 🧪 Testing

The database setup script creates test data:

### Default Users
- **Admin**: admin@carrental.com / admin123
- **Customer**: john@example.com / customer123

### Sample Data
- 5 cars (4 available, 1 rented)
- 1 approved booking
- 1 completed payment

## 📱 Example Usage

### 1. Register and Login
```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "password123",
    "phoneNumber": "+254700000002",
    "idNumber": "ID789012"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### 2. Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "carId": 1,
    "startDate": "2025-08-25",
    "endDate": "2025-08-30"
  }'
```

### 3. List Bookings
```bash
# Customer sees only their bookings
curl -X GET "http://localhost:3000/api/bookings?status=pending&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 4. Update Booking
```bash
curl -X PUT http://localhost:3000/api/bookings/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "endDate": "2025-08-31",
    "status": "approved"
  }'
```

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PASSWORD=your-secure-password
JWT_SECRET=your-super-long-random-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### PM2 Deployment
```bash
npm install -g pm2
pm2 start index.js --name "car-rental-api"
pm2 startup
pm2 save
```

## 🛡️ Error Handling

The API provides comprehensive error responses:
- **400**: Validation errors with detailed field information
- **401**: Authentication required
- **403**: Insufficient permissions
- **404**: Resource not found
- **409**: Business logic conflicts (e.g., car not available)
- **500**: Server errors

## 📊 Monitoring

### Health Check
```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "OK",
  "timestamp": "2025-08-17T10:00:00.000Z"
}
```

## 🔧 Development

### Code Structure
```
backend/
├── config/
│   └── database.js          # Database configuration
├── middleware/
│   ├── auth.js              # Authentication middleware
│   └── validation.js        # Input validation
├── models/
│   ├── User.js              # User model
│   ├── Car.js               # Car model
│   ├── Booking.js           # Booking model (CORE)
│   ├── Payment.js           # Payment model
│   └── index.js             # Model associations
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── bookings.js          # Booking routes (CORE)
│   ├── cars.js              # Car routes
│   ├── users.js             # User routes
│   └── payments.js          # Payment routes
├── index.js                 # Main server file
├── setup-db.js              # Database setup script
└── API_DOCUMENTATION.md     # Detailed API docs
```

## 📈 Performance Features

- **Pagination**: Efficient data loading with configurable limits
- **Filtering**: Database-level filtering for optimal performance
- **Associations**: Optimized includes to reduce N+1 queries
- **Indexing**: Proper database indexes on foreign keys
- **Connection Pooling**: Efficient database connection management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

**Note**: This implementation focuses specifically on the booking system branch with comprehensive booking management, security, validation, and business logic as requested. The system is production-ready with proper error handling, authentication, and database design.
