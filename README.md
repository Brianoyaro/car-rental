#Car-rental
--
This is a car rental application. It allows one to browse for rental cars and select their desireed car, rent it for any number o days from the comfort of their home without having to make long queues or several dozen phone calls. It is created with security in mind and privacy too.

## Database Structure
--
1. **Users**
- id, name, email, passwordHash, phoneNumber, role, idNumber, createdAt
2. **Car**
- id, make, model, manufactureYear, licensePlate, pricePerDay, status, imageUrl, createdAt
3. **boooking**
- id, userId, carId, startDate, endDate, totalPrice, status, createdAt
4. **Payment**
- id, bookindId, status, paymentMethod, createdAt

## User Stories
--
### Customer

- As a customer, I want to view available cars so that I can choose one to rent.

- As a customer, I want to book a car so that I can rent it for my desired dates.

- As a customer, I want to pay online or via Mpesa so that my booking is confirmed.

- As a customer, I want to cancel a booking if my plans change.

- As a customer, I want to see my rental history so I can track my expenses.

### Admin

- As an admin, I want to add new cars so customers can rent them.

- As an admin, I want to edit car details so I can update prices or availability.

- As an admin, I want to approve or reject bookings to prevent misuse.

- As an admin, I want to see all payments to manage financial records.

- As an admin, I want to view all customers so I can manage users.

## Proposed API endpoints
### Auth
Method|Endpoint|Description|Auth Required
| :-----: | :---------- | :---------: | ----------: |
POST	|/api/auth/register	|Create a new user (customer or admin)	|No
POST	|/api/auth/login	|Login and get JWT	|No
GET	|/api/auth/me	|Get logged-in user info	|Yes
POST	/api/auth/logout	|Invalidate token (optional if using stateless JWT)	|Yes
### Users
Method	|Endpoint	"Description	|Auth Required
| :-----: | :---------- | :---------: | ----------: |
GET	|/api/users	|Get all users (Admin only)	|Admin
GET	|/api/users/:id	|Get specific user profile	|Admin / Owner
PUT	|/api/users/:id	|Update user profile	|Admin / Owner
DELETE	|/api/users/:id	|Delete user	"Admin
### Cars
Method	|Endpoint	|Description	|Auth Required
| :-----: | :---------- | :---------: | ----------: |
GET	|/api/cars|	Get list of cars (available & rented)	|No
GET	|/api/cars/:id	|Get car details	|No
POST|	/api/cars	|Add new car to inventory|	Admin
PUT	|/api/cars/:id	|Update car info	|Admin
DELETE|	/api/cars/:id|	Remove car from system	|Admin
### Bookings
Method|	Endpoint	|Description	|Auth Required
| :-----: | :---------- | :---------: | ----------: |
POST	|/api/bookings|	Create a booking (rent a car)	|Customer
GET	|/api/bookings	|List all bookings (Admin) or own bookings (Customer)	|Yes
GET	|/api/bookings/:id	|Get booking details	|Yes
PUT	|/api/bookings/:id	|Update booking (change dates, extend rental)	|Admin / Customer
DELETE|	/api/bookings/:id|	Cancel booking	|Admin / Customer
### Payments
Method|	Endpoint|	Description|	Auth Required
| :-----: | :---------- | :---------: | ----------: |
POST	|/api/payments	|Create payment for booking	|Customer
GET	|/api/payments/:id	|Get payment details	|Admin / Customer