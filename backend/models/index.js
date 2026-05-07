const User = require('./User');
const Tender = require('./Tender');
const Bid = require('./Bid');

// Associations
Tender.belongsTo(User, { foreignKey: 'officerId', as: 'officer' });
User.hasMany(Tender, { foreignKey: 'officerId' });

Bid.belongsTo(Tender, { foreignKey: 'tenderId' });
Tender.hasMany(Bid, { foreignKey: 'tenderId' });

Bid.belongsTo(User, { foreignKey: 'bidderId', as: 'bidder' });
User.hasMany(Bid, { foreignKey: 'bidderId' });

module.exports = {
  User,
  Tender,
  Bid
};
