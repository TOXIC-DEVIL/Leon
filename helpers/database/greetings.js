const { DataTypes } = require('sequelize');
const { database } = require('../database.js');

const Greetings = database.define('Greetings', {
  type: {
    type: DataTypes.STRING,
    unique: false,
    allowNull: false,
  },
  chat: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Greetings.sync();

module.exports = {
  greetings: Greetings,
  setMessage: async (type, chat, text = '') => {
    let exist = await Greetings.findAll({ where: { type: type, chat: chat } });
    if (exist.length < 1) return await Greetings.create({ type, chat, text });
    return await exist[0].update({ text });
  },
  getMessage: async (type, chat) => {
    let exist = await Greetings.findAll({ where: { type: type, chat: chat } });
    if (exist.length < 1) return false;
    return exist[0].text;
  },
  deleteMessage: async (type, chat) => {
    let exist = await Greetings.findAll({ where: { type: type, chat: chat } });
    if (exist.length < 1) return false;
    return await exist[0].destroy();
  }
};
