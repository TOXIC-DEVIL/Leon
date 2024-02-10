const { allCommands } = require('../index');

module.exports = {
  command: 'menu',
  info: '',
  private: false,
  func: async (sock, msg, text) => {
    let cmd = '';
    allCommands().forEach(async (cm) => {
       if (cm.command !== 'menu') cmd += '*' + (process.env?.PREFIX || '/') + cm.command + '* -\n_' + cm.info + '_\n\n';
    });
    return await msg.reply({ text: cmd });
  }
}
