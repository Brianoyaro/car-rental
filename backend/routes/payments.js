const express = require('express');
const { Payment, Booking, Car } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * POST /api/payments
 * Create payment for booking (customer)
 */
router.post('/', authenticate, authorize('customer', 'admin'), async (req, res) => {
  try {
    const { bookingId, paymentMethod } = req.body;

    // Validate booking exists and belongs to user (unless admin)
    const booking = await Booking.findByPk(bookingId, {
      include: [{ model: Car, as: 'car' }]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (req.user.role === 'customer' && booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Create payment
    const payment = await Payment.create({
      bookingId,
      paymentMethod,
      amount: booking.totalPrice,
      status: 'pending'
    });

    res.status(201).json({
      message: 'Payment initiated successfully',
      payment
    });

  } catch (error) {
    console.error('Payment creation error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
});

/**
 * GET /api/payments/:id
 * Get payment details (admin or payment owner)
 */
router.get('/:id', authenticate, async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [
        {
          model: Booking,
          as: 'booking',
          include: [
            { model: Car, as: 'car' }
          ]
        }
      ]
    });

    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }

    // Check permission
    if (req.user.role === 'customer' && payment.booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ payment });

  } catch (error) {
    console.error('Payment fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch payment details' });
  }
});

module.exports = router;
