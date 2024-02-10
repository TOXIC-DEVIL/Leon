const { Heroku } = require('../helpers/heroku');

module.exports = {
  command: 'restart',
  info: 'Restarts the bot.',
  private: true,
  func: async (sock, msg, text) => {
    if ((process.env?.PLATFORM).toLowerCase() !== 'heroku') return await msg.reply({ text: '*You must deploy bot on heroku for bot administrative commands.*' });
    let restart = await Heroku('restart');
    if (!restart) {
      return await msg.reply({ text: '*Please ensure that the HEROKU_APP_NAME environment variable and app name you provided while deploying are same.*' });
    } else {
      return await msg.reply({ text: '*🔁 Restarting...*' });
    }
  }
};
