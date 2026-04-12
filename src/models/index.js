const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CampaignModel = require('./Campaign');
const CharacterModel = require('./Character');
const SessionModel = require('./Session');

const Campaign = CampaignModel(sequelize, DataTypes);
const Character = CharacterModel(sequelize, DataTypes);
const Session = SessionModel(sequelize, DataTypes);

Campaign.hasMany(Character, {
  foreignKey: 'campaignId',
  as: 'characters',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Campaign.hasMany(Session, {
  foreignKey: 'campaignId',
  as: 'sessions',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});

Character.belongsTo(Campaign, {
  foreignKey: 'campaignId',
  as: 'campaign'
});

Session.belongsTo(Campaign, {
  foreignKey: 'campaignId',
  as: 'campaign'
});

module.exports = {
  sequelize,
  Campaign,
  Character,
  Session
};