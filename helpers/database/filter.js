const { DataTypes } = require('sequelize');
const { database } = require('../database.js');

const filter = database.define('Filter', {
    chat: {
        type: DataTypes.STRING,
        allowNull: false
    },
    match: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    response: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

filter.sync();

module.exports = {
  filter: filter,
  addFilter: async (chat, match, response) => {
    let exists = await filter.findAll({ where: { chat: chat, match: match } });
    if (exists.length < 1) return await filter.create({ chat, match, response });
    return await exists[0].update({ response });
  },
  delFilter: async (chat, match, action) => {
    if (action == 'all') {
      await filter.findAll({ where: { chat: chat } }).map((f) => {
        f.destroy();
      });
    }
    let exists = await filter.findAll({ where: { chat: chat, match: match } });
    if (exists.length < 1) return false;
    return exists[0].destroy();
  },
  getFilter: async (chat) => {
    return await filter.findAll({ where: { chat } });
  }
};
    
