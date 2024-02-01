const { delFilter } = require('../helpers/database/filter');

module.exports = {
  command: 'delfilter',
  info: 'deletes filter from the chat.',
  private: true,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter the filter match to delete!*\n*Example:*\n*- ' + (process.env?.PREFIX || '/') + 'delfilter hey' });
    let filter = await delFilter(msg.chat, text);
    if (!filter) return await msg.reply({ text: '*There is no such added filter!*' });
    return await msg.reply({ text: '*Successfully deleted ' + text + ' filter!*' });
  }
};
