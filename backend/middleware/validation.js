const { body, param, query, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

const validateBookingCreation = [
  body('carId')
    .isInt({ min: 1 })
    .withMessage('Valid car ID is required'),
  
  body('startDate')
    .isISO8601()
    .withMessage('Valid start date is required (YYYY-MM-DD)')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        throw new Error('Start date must be today or in the future');
      }
      return true;
    }),
  
  body('endDate')
    .isISO8601()
    .withMessage('Valid end date is required (YYYY-MM-DD)')
    .custom((value, { req }) => {
      const startDate = new Date(req.body.startDate);
      const endDate = new Date(value);
      
      if (endDate <= startDate) {
        throw new Error('End date must be after start date');
      }
      
      // Limit rental period to 365 days
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 365) {
        throw new Error('Rental period cannot exceed 365 days');
      }
      
      return true;
    }),
  
  handleValidationErrors
];

const validateBookingUpdate = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid booking ID is required'),
  
  body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required (YYYY-MM-DD)')
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (startDate < today) {
        throw new Error('Start date must be today or in the future');
      }
      return true;
    }),
  
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required (YYYY-MM-DD)'),
  
  body('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'])
    .withMessage('Invalid status value'),
  
  handleValidationErrors
];

const validateBookingQuery = [
  query('status')
    .optional()
    .isIn(['pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'])
    .withMessage('Invalid status filter'),
  
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date filter (YYYY-MM-DD)'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date filter (YYYY-MM-DD)'),
  
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  handleValidationErrors
];

const validateBookingId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid booking ID is required'),
  
  handleValidationErrors
];

module.exports = {
  validateBookingCreation,
  validateBookingUpdate,
  validateBookingQuery,
  validateBookingId,
  handleValidationErrors
};
