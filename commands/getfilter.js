const { getFilter } = require('../helpers/database/filter');

module.exports = {
  command: 'getfilter',
  info: 'Gets added filters of the chat.',
  private: true,
  func: async (sock, msg, text) => {
    let filters = await getFilter(msg.chat);
    return await msg.reply({ text: '*Filters of this chat:*\n' + (await filters.map((filter) => '```- ' + filter.match + '```')).join('\n') });
  }
};
