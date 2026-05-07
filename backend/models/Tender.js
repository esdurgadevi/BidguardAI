const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Tender = sequelize.define('Tender', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  referenceNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('DRAFT', 'PUBLISHED', 'CLOSED'),
    defaultValue: 'DRAFT'
  },
  criteria: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON object containing extracted Technical, Financial, and Compliance criteria'
  },
  officerId: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  timestamps: true
});

module.exports = Tender;
