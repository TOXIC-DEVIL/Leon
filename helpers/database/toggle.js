const { DataTypes } = require('sequelize');
const { database } = require('../database.js');

const Toggle = database.define('Toggle', {
  type: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },
  chat: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  status: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
});

Toggle.sync();

module.exports = {
  toggle: Toggle,
  enable: async (type, chat) => {
    let exist = await Toggle.findAll({ where: { type: type, chat: chat } });
    if (exist.length < 1) return await Toggle.create({ type, chat, status: true });
    return await exist[0].update({ status: true });
  },
  status: async (type, chat) => {
    let exist = await Toggle.findAll({ where: { type: type, chat: chat } });
    if (exist.length < 1) return false;
    return exist[0].status;
  },
  disable: async (type, chat) => {
    let exist = await Toggle.findAll({ where: { type: type, chat: chat } });
    if (exist.length < 1) return false;
    return await exist[0].destroy();
  }
};
