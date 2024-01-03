const command = require('../helpers/database/commands');

module.exports = {
  command: 'commands',
  info: 'Shows installed external commands list.',
  func: async (sock, msg, text) => {
    let list = '*Installed external commands are:*\n\n';
    let l = await command.list();
    if (l.length < 1) return await msg.reply({ text: '*There is no external command installed!*' });
    list += l.forEach(async (command) => '*' + command.name + '* : ' + command.url).join('\n\n');
    return await msg.reply({ text: list });
  }
};
