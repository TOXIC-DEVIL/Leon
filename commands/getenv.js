const { Heroku } = require('../helpers/heroku');

module.exports = {
  command: 'getenv',
  info: 'Gets the value of environment variable of given key.',
  private: true,
  func: async (sock, msg, text) => {
    if ((process.env?.PLATFORM).toLowerCase() !== 'heroku') return await msg.reply({ text: '*You must deploy bot on heroku for bot administrative commands.*' });
    if (!text) return await msg.reply({ text: '*Please enter the environment variable key!*' });
    let value = await Heroku('getenv', text);
    if (!value) {
      return await msg.reply({ text: '*There is no such environment variable key!*' });
    } else {
      return await msg.reply({ text: '*' + text + ': ' + value + '*' });
    }
  }
};
