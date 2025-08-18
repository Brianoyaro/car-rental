const express = require('express');
const { Op } = require('sequelize');
const { Car } = require('../models');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

/**
 * GET /api/cars
 * Get list of cars (public access)
 */
router.get('/', async (req, res) => {
  try {
    const { status, make, model, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    const whereClause = {};
    
    if (status) {
      whereClause.status = status;
    }
    
    if (make) {
      whereClause.make = { [Op.iLike]: `%${make}%` };
    }
    
    if (model) {
      whereClause.model = { [Op.iLike]: `%${model}%` };
    }
    
    if (minPrice || maxPrice) {
      const priceFilter = {};
      if (minPrice) priceFilter[Op.gte] = parseFloat(minPrice);
      if (maxPrice) priceFilter[Op.lte] = parseFloat(maxPrice);
      whereClause.pricePerDay = priceFilter;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: cars } = await Car.findAndCountAll({
      where: whereClause,
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    const totalPages = Math.ceil(count / parseInt(limit));

    res.json({
      cars,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCars: count,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Cars fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

/**
 * GET /api/cars/:id
 * Get car details (public access)
 */
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findByPk(req.params.id);
    
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    res.json({ car });

  } catch (error) {
    console.error('Car fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch car details' });
  }
});

/**
 * POST /api/cars
 * Add new car (admin only)
 */
router.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { make, model, manufactureYear, licensePlate, pricePerDay, imageUrl } = req.body;

    const car = await Car.create({
      make,
      model,
      manufactureYear,
      licensePlate,
      pricePerDay,
      imageUrl,
      status: 'available'
    });

    res.status(201).json({
      message: 'Car added successfully',
      car
    });

  } catch (error) {
    console.error('Car creation error:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'License plate already exists' });
    }
    res.status(500).json({ error: 'Failed to add car' });
  }
});

module.exports = router;
