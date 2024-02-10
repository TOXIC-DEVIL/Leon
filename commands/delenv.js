const { Heroku } = require('../helpers/heroku');

module.exports = {
  command: 'delenv',
  info: 'Deletes environment variable of given key.',
  private: true,
  func: async (sock, msg, text) => {
    if ((process.env?.PLATFORM).toLowerCase() !== 'heroku') return await msg.reply({ text: '*You must deploy bot on heroku for bot administrative commands.*' });
    if (!text) return await msg.reply({ text: '*Please enter the environment variable key to delete!*' });
    let env = await Heroku('delenv', text);
    if (!env) {
      return await msg.reply({ text: '*There is no such environment variable key to delete!*' });
    } else {
      return await msg.reply({ text: '*Successfully deleted environment variable!*' });
    }
  }
};
