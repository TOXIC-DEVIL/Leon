const { Heroku } = require('../helpers/heroku');

module.exports = {
  command: 'setenv',
  info: 'Sets environment variable with given key and value.',
  private: true,
  func: async (sock, msg, text) => {
    if ((process.env?.PLATFORM).toLowerCase() !== 'heroku') return await msg.reply({ text: '*You must deploy bot on heroku for bot administrative commands.*' });
    if (!text) return await msg.reply({ text: '*Please enter key and value by splitting with space character!*\n\n_You can insert the value in "<double quotes>" if value includes space character._' });
    let value = text.includes('"') ? text.split('"').replace(/"/g, '') : text.split(' ')[1];
    let key = text.includes('"') ? text.replace('"' + value + '"', '').trim() : text.replace(value, '').trim();
    let env = await Heroku('setenv', [key, value]);
    if (!env) {
      return await msg.reply({ text: '*Please ensure that the HEROKU_APP_NAME environment variable and app name you provided while deploying are same.*' });
    } else {
      return await msg.reply({ text: '*Successfully set variable:*\n*' + key + '* - _' + value + '_' });
    }
  }
};
