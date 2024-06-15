const { allCommands } = require('../index');
const { PREFIX } = require('../config');

module.exports = {
  command: 'menu',
  info: '',
  private: false,
  func: async (sock, msg, text) => {
    let cmd = '';
    allCommands().forEach(async (cm) => {
       if (cm.command !== 'menu') cmd += '*' + PREFIX + cm.command + '* -\n_' + cm.info + '_\n\n';
    });
    return await msg.reply({ text: cmd });
  }
}
