const express = require('express');
const { Op } = require('sequelize');
const { Booking, Car, User, Payment } = require('../models');
const { authenticate, authorize, isOwnerOrAdmin } = require('../middleware/auth');
const {
  validateBookingCreation,
  validateBookingUpdate,
  validateBookingQuery,
  validateBookingId
} = require('../middleware/validation');

const router = express.Router();

/**
 * POST /api/bookings
 * Create a new booking (customer authentication required)
 */
router.post('/', authenticate, authorize('customer', 'admin'), validateBookingCreation, async (req, res) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const userId = req.user.id;

    // Check if car exists and is available
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    if (car.status !== 'available') {
      return res.status(400).json({ error: 'Car is not available for booking' });
    }

    // Check car availability for the requested dates
    const isAvailable = await Booking.checkAvailability(carId, startDate, endDate);
    if (!isAvailable) {
      return res.status(409).json({ 
        error: 'Car is not available for the selected dates',
        message: 'Please choose different dates or another car'
      });
    }

    // Calculate total price
    const totalPrice = Booking.calculateTotalPrice(startDate, endDate, car.pricePerDay);

    // Create the booking
    const booking = await Booking.create({
      userId,
      carId,
      startDate,
      endDate,
      totalPrice,
      status: 'pending'
    });

    // Fetch the complete booking with associations
    const createdBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'make', 'model', 'licensePlate', 'pricePerDay', 'imageUrl']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phoneNumber']
        }
      ]
    });

    res.status(201).json({
      message: 'Booking created successfully',
      booking: createdBooking
    });

  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      error: 'Failed to create booking',
      details: error.message 
    });
  }
});

/**
 * GET /api/bookings
 * List all bookings (admin) or own bookings (customer)
 * Supports filtering by status, date range, and pagination
 */
router.get('/', authenticate, validateBookingQuery, async (req, res) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Build where clause
    const whereClause = {};

    // Role-based filtering
    if (userRole === 'customer') {
      whereClause.userId = userId;
    }

    // Status filtering
    if (status) {
      whereClause.status = status;
    }

    // Date range filtering
    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) {
        dateFilter[Op.gte] = startDate;
      }
      if (endDate) {
        dateFilter[Op.lte] = endDate;
      }
      whereClause.startDate = dateFilter;
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);

    // Fetch bookings
    const { count, rows: bookings } = await Booking.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'make', 'model', 'licensePlate', 'pricePerDay', 'imageUrl']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phoneNumber']
        },
        {
          model: Payment,
          as: 'payments',
          attributes: ['id', 'status', 'paymentMethod', 'amount']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    // Calculate pagination metadata
    const totalPages = Math.ceil(count / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.json({
      bookings,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBookings: count,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Bookings fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch bookings',
      details: error.message 
    });
  }
});

/**
 * GET /api/bookings/:id
 * Get specific booking details (admin or booking owner)
 */
router.get('/:id', authenticate, isOwnerOrAdmin, validateBookingId, async (req, res) => {
  try {
    const bookingId = req.params.id;

    const booking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'make', 'model', 'licensePlate', 'pricePerDay', 'imageUrl', 'status']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phoneNumber', 'idNumber']
        },
        {
          model: Payment,
          as: 'payments',
          attributes: ['id', 'status', 'paymentMethod', 'amount', 'transactionId', 'createdAt']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ booking });

  } catch (error) {
    console.error('Booking fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch booking details',
      details: error.message 
    });
  }
});

/**
 * PUT /api/bookings/:id
 * Update booking (change dates, extend rental, update status)
 * Admin can update any booking, customers can only update their own
 */
router.put('/:id', authenticate, isOwnerOrAdmin, validateBookingUpdate, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const { startDate, endDate, status } = req.body;
    const userRole = req.user.role;

    // Fetch existing booking
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Car, as: 'car' }]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if booking can be modified
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({ 
        error: 'Cannot modify completed or cancelled bookings' 
      });
    }

    // Only admins can update certain statuses
    if (status && userRole === 'customer') {
      const allowedCustomerStatuses = ['cancelled'];
      if (!allowedCustomerStatuses.includes(status)) {
        return res.status(403).json({ 
          error: 'Customers can only cancel their bookings' 
        });
      }
    }

    // Prepare update data
    const updateData = {};
    
    // Handle date changes
    if (startDate || endDate) {
      const newStartDate = startDate || booking.startDate;
      const newEndDate = endDate || booking.endDate;

      // Validate date logic
      if (new Date(newEndDate) <= new Date(newStartDate)) {
        return res.status(400).json({ error: 'End date must be after start date' });
      }

      // Check availability for new dates (excluding current booking)
      const isAvailable = await Booking.checkAvailability(
        booking.carId, 
        newStartDate, 
        newEndDate, 
        bookingId
      );

      if (!isAvailable) {
        return res.status(409).json({ 
          error: 'Car is not available for the new dates' 
        });
      }

      // Recalculate total price
      const newTotalPrice = Booking.calculateTotalPrice(
        newStartDate, 
        newEndDate, 
        booking.car.pricePerDay
      );

      updateData.startDate = newStartDate;
      updateData.endDate = newEndDate;
      updateData.totalPrice = newTotalPrice;
    }

    // Handle status change
    if (status) {
      updateData.status = status;

      // Update car status based on booking status
      if (status === 'approved') {
        await Car.update({ status: 'rented' }, { where: { id: booking.carId } });
      } else if (status === 'cancelled' || status === 'completed' || status === 'rejected') {
        await Car.update({ status: 'available' }, { where: { id: booking.carId } });
      }
    }

    // Update the booking
    await booking.update(updateData);

    // Fetch updated booking with associations
    const updatedBooking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'make', 'model', 'licensePlate', 'pricePerDay', 'imageUrl', 'status']
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'phoneNumber']
        },
        {
          model: Payment,
          as: 'payments',
          attributes: ['id', 'status', 'paymentMethod', 'amount']
        }
      ]
    });

    res.json({
      message: 'Booking updated successfully',
      booking: updatedBooking
    });

  } catch (error) {
    console.error('Booking update error:', error);
    res.status(500).json({ 
      error: 'Failed to update booking',
      details: error.message 
    });
  }
});

/**
 * DELETE /api/bookings/:id
 * Cancel booking (admin or booking owner)
 * Updates car status to available and handles refund logic
 */
router.delete('/:id', authenticate, isOwnerOrAdmin, validateBookingId, async (req, res) => {
  try {
    const bookingId = req.params.id;

    // Fetch booking with payments
    const booking = await Booking.findByPk(bookingId, {
      include: [
        { model: Car, as: 'car' },
        { model: Payment, as: 'payments' }
      ]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed') {
      return res.status(400).json({ 
        error: 'Cannot cancel a completed booking' 
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ 
        error: 'Booking is already cancelled' 
      });
    }

    // Cancel the booking
    await booking.update({ status: 'cancelled' });

    // Update car status to available
    await Car.update(
      { status: 'available' }, 
      { where: { id: booking.carId } }
    );

    // Handle refunds for completed payments
    const completedPayments = booking.payments.filter(p => p.status === 'completed');
    if (completedPayments.length > 0) {
      // In a real application, you would integrate with payment providers
      // For now, we'll just mark payments as refunded
      await Payment.update(
        { status: 'refunded' },
        { 
          where: { 
            bookingId: bookingId,
            status: 'completed'
          } 
        }
      );
    }

    // Fetch updated booking
    const cancelledBooking = await Booking.findByPk(bookingId, {
      include: [
        {
          model: Car,
          as: 'car',
          attributes: ['id', 'make', 'model', 'licensePlate', 'status']
        },
        {
          model: Payment,
          as: 'payments',
          attributes: ['id', 'status', 'paymentMethod', 'amount']
        }
      ]
    });

    res.json({
      message: 'Booking cancelled successfully',
      booking: cancelledBooking,
      refundsProcessed: completedPayments.length > 0
    });

  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({ 
      error: 'Failed to cancel booking',
      details: error.message 
    });
  }
});

/**
 * GET /api/bookings/:id/availability
 * Check car availability for specific dates (useful for date picker)
 */
router.get('/:carId/availability', async (req, res) => {
  try {
    const { carId } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({ 
        error: 'Start date and end date are required' 
      });
    }

    // Check if car exists
    const car = await Car.findByPk(carId);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    // Check availability
    const isAvailable = await Booking.checkAvailability(carId, startDate, endDate);

    res.json({
      carId: parseInt(carId),
      startDate,
      endDate,
      available: isAvailable,
      car: {
        id: car.id,
        make: car.make,
        model: car.model,
        pricePerDay: car.pricePerDay,
        status: car.status
      }
    });

  } catch (error) {
    console.error('Availability check error:', error);
    res.status(500).json({ 
      error: 'Failed to check availability',
      details: error.message 
    });
  }
});

module.exports = router;
