const { addFilter } = require('../helpers/database/filter');

module.exports = {
  command: 'filter',
  info: 'Adds filter to the chat.',
  private: true,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter the filter match and response!*\n*Example:*\n*- ' + (process.env?.PREFIX || '/') + 'filter \"hey\" \"hello\"' });
    let [match, response] = text.match(/"([^"]*)"/g);
    await addFilter(msg.chat, match.replace(/"/g, ''), response.replace(/"/g, ''));
    return await msg.reply({ text: '*Successfully set filter!*\n```' + match + ' - ' + response + '```' });
  }
};
