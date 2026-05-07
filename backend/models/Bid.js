const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Bid = sequelize.define('Bid', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  tenderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  bidderId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  technicalDocsPath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  financialDocsPath: {
    type: DataTypes.STRING,
    allowNull: false
  },
  extractedTechnical: {
    type: DataTypes.JSON,
    allowNull: true
  },
  extractedFinancial: {
    type: DataTypes.JSON,
    allowNull: true
  },
  aiRecommendation: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'Result of AI comparison between Bidder credentials and Tender criteria'
  },
  status: {
    type: DataTypes.ENUM('PENDING', 'TECHNICAL_PASSED', 'REJECTED', 'SELECTED'),
    defaultValue: 'PENDING'
  },
  submissionDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
});

module.exports = Bid;
