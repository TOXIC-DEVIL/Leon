const { Heroku } = require('../helpers/heroku');
const { PLATFORM } = require('../config');

module.exports = {
  command: 'shutdown',
  info: 'Shutdowns the bot.',
  private: true,
  func: async (sock, msg, text) => {
    if (PLATFORM.toLowerCase() !== 'heroku') return await msg.reply({ text: '*You must deploy bot on heroku for bot administrative commands.*' });
    let shutdown = await Heroku('shutdown');
    if (!shutdown) {
      return await msg.reply({ text: '*Please ensure that the HEROKU_APP_NAME environment variable and app name you provided while deploying are same.*' });
    } else {
      return await msg.reply({ text: '*⛔ Shutting down...*' });
    }
  }
};
