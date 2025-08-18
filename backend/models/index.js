const User = require('./User');
const Car = require('./Car');
const Booking = require('./Booking');
const Payment = require('./Payment');

// User associations
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });

// Car associations
Car.hasMany(Booking, { foreignKey: 'carId', as: 'bookings' });

// Booking associations
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Booking.belongsTo(Car, { foreignKey: 'carId', as: 'car' });
Booking.hasMany(Payment, { foreignKey: 'bookingId', as: 'payments' });

// Payment associations
Payment.belongsTo(Booking, { foreignKey: 'bookingId', as: 'booking' });

module.exports = {
  User,
  Car,
  Booking,
  Payment
};
