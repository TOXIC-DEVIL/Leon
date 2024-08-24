const { uninstall } = require('../helpers/database/commands');
const fs = require('fs');

module.exports = {
  command: 'uninstall',
  info: 'Uninstalls an external command from given name.',
  private: true,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter an installed external command name to uninstall!*' });
    let res = await uninstall(text);
    let file_path = __dirname + '/' + text + '.js';
    if (!res || !fs.existsSync(file_path)) return await msg.reply({ text: '*There is no external command with the name:* ```' + text + '```' });
    let file = require.resolve(file_path);
    delete require.cache[file];
    fs.unlinkSync(file_path);
    return await msg.reply({ text: '*Uninstalled ' + text + '!*' });
  }
};
