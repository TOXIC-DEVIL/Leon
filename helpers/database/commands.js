const { DataTypes } = require('sequelize');
const { database } = require('../database.js');

const commands = database.define('Commands', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

commands.sync();

module.exports = {
  commands: commands,
  install: async (name, url) => {
    let exist = await commands.findAll({ where: { name: name, url: url } });
    if (exist.length < 1) return await commands.create({ name: name, url: url });
    return await exist[0].update({ name: name, url: url });
  },
  uninstall: async (name) => {
    let exist = await commands.findAll({ where: { name: name } });
    if (exist.length < 1) return false;
    return exist[0].destroy();
  },
  list: async () => {
    let l = await commands.findAll();
    return l;
  }
};
