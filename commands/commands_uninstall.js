const { uninstall } = require('../helpers/database/commands');
const fs = require('fs');
const { Heroku } = require('../helpers/heroku');

module.exports = {
  command: 'uninstall',
  info: 'Uninstalls an external command from given name.',
  private: true,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter an installed external command name to uninstall!*' });
    let res = await uninstall(text);
    if (!res || !fs.existsSync(__dirname + '/' + text + '.js')) return await msg.reply({ text: '*There is no external command with the name:*\n```' + text + '```' });
    fs.unlinkSync(__dirname + '/' + text + '.js');
    await msg.reply({ text: '*Uninstalled ' + text + '!*' });
    return Heroku('restart');
  }
};
