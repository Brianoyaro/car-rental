const { sequelize } = require('./config/database');
const { User, Car, Booking, Payment } = require('./models');

const seedData = async () => {
  try {
    console.log('Starting database setup...');

    // Force sync to recreate tables
    await sequelize.sync({ force: true });
    console.log('Database tables created successfully.');

    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@carrental.com',
      passwordHash: 'admin123',
      phoneNumber: '+254700000000',
      idNumber: 'ADMIN001',
      role: 'admin'
    });

    // Create customer user
    const customerUser = await User.create({
      name: 'John Doe',
      email: 'john@example.com',
      passwordHash: 'customer123',
      phoneNumber: '+254700000001',
      idNumber: 'ID123456',
      role: 'customer'
    });

    console.log('Users created successfully.');

    // Create sample cars
    const cars = await Car.bulkCreate([
      {
        make: 'Toyota',
        model: 'Corolla',
        manufactureYear: 2022,
        licensePlate: 'KAA 001A',
        pricePerDay: 3000.00,
        status: 'available',
        imageUrl: 'https://example.com/toyota-corolla.jpg'
      },
      {
        make: 'Honda',
        model: 'Civic',
        manufactureYear: 2021,
        licensePlate: 'KBB 002B',
        pricePerDay: 3500.00,
        status: 'available',
        imageUrl: 'https://example.com/honda-civic.jpg'
      },
      {
        make: 'Nissan',
        model: 'X-Trail',
        manufactureYear: 2023,
        licensePlate: 'KCC 003C',
        pricePerDay: 5000.00,
        status: 'available',
        imageUrl: 'https://example.com/nissan-xtrail.jpg'
      },
      {
        make: 'Mercedes',
        model: 'C-Class',
        manufactureYear: 2022,
        licensePlate: 'KDD 004D',
        pricePerDay: 8000.00,
        status: 'available',
        imageUrl: 'https://example.com/mercedes-c-class.jpg'
      },
      {
        make: 'BMW',
        model: 'X5',
        manufactureYear: 2023,
        licensePlate: 'KEE 005E',
        pricePerDay: 10000.00,
        status: 'rented',
        imageUrl: 'https://example.com/bmw-x5.jpg'
      }
    ]);

    console.log('Cars created successfully.');

    // Create sample booking
    const booking = await Booking.create({
      userId: customerUser.id,
      carId: cars[4].id, // BMW X5
      startDate: new Date('2025-08-20'),
      endDate: new Date('2025-08-25'),
      totalPrice: 50000.00, // 5 days * 10000
      status: 'approved'
    });

    console.log('Sample booking created successfully.');

    // Create sample payment
    const payment = await Payment.create({
      bookingId: booking.id,
      paymentMethod: 'mpesa',
      amount: booking.totalPrice,
      status: 'completed',
      transactionId: 'MPESA123456789'
    });

    console.log('Sample payment created successfully.');

    console.log('\n=== Database Setup Complete ===');
    console.log('Admin User:');
    console.log('  Email: admin@carrental.com');
    console.log('  Password: admin123');
    console.log('\nCustomer User:');
    console.log('  Email: john@example.com');
    console.log('  Password: customer123');
    console.log('\nSample data includes:');
    console.log('  - 5 cars (4 available, 1 rented)');
    console.log('  - 1 approved booking');
    console.log('  - 1 completed payment');

  } catch (error) {
    console.error('Database setup failed:', error);
  } finally {
    await sequelize.close();
  }
};

seedData();
