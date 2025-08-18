const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Booking = sequelize.define('Booking', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  carId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'car_id',
    references: {
      model: 'cars',
      key: 'id'
    }
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'start_date',
    validate: {
      isDate: true,
      isAfter: {
        args: new Date().toISOString().split('T')[0],
        msg: 'Start date must be in the future'
      }
    }
  },
  endDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'end_date',
    validate: {
      isDate: true,
      isAfterStartDate(value) {
        if (value <= this.startDate) {
          throw new Error('End date must be after start date');
        }
      }
    }
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'total_price',
    validate: {
      min: 0.01
    }
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'active', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'pending'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'bookings',
  timestamps: false,
  hooks: {
    beforeValidate: (booking) => {
      // Ensure end date is after start date
      if (booking.startDate && booking.endDate && booking.endDate <= booking.startDate) {
        throw new Error('End date must be after start date');
      }
    }
  }
});

// Class methods for business logic
Booking.calculateTotalPrice = function(startDate, endDate, pricePerDay) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return (diffDays * parseFloat(pricePerDay)).toFixed(2);
};

Booking.checkAvailability = async function(carId, startDate, endDate, excludeBookingId = null) {
  const { Op } = require('sequelize');
  
  const whereClause = {
    carId,
    status: {
      [Op.in]: ['pending', 'approved', 'active']
    },
    [Op.or]: [
      {
        startDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      {
        endDate: {
          [Op.between]: [startDate, endDate]
        }
      },
      {
        [Op.and]: [
          { startDate: { [Op.lte]: startDate } },
          { endDate: { [Op.gte]: endDate } }
        ]
      }
    ]
  };

  if (excludeBookingId) {
    whereClause.id = { [Op.ne]: excludeBookingId };
  }

  const conflictingBookings = await Booking.findAll({ where: whereClause });
  return conflictingBookings.length === 0;
};

module.exports = Booking;
