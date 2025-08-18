const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Car = sequelize.define('Car', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  make: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50],
      notEmpty: true
    }
  },
  model: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      len: [2, 50],
      notEmpty: true
    }
  },
  manufactureYear: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'manufacture_year',
    validate: {
      min: 1900,
      max: new Date().getFullYear() + 1
    }
  },
  licensePlate: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'license_plate',
    validate: {
      notEmpty: true
    }
  },
  pricePerDay: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    field: 'price_per_day',
    validate: {
      min: 0.01
    }
  },
  status: {
    type: DataTypes.ENUM('available', 'rented', 'maintenance'),
    allowNull: false,
    defaultValue: 'available'
  },
  imageUrl: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'image_url',
    validate: {
      isUrl: true
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'cars',
  timestamps: false
});

module.exports = Car;
