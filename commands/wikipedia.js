const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'wiki',
  info: 'Searches for article of given topic in wikipedia.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter any article topic!*' });
    let json = await parseJson('https://toxicdevilapi.vercel.app/search/wikipedia?lang=en&query=' + text);
    if (json.status !== true) return await msg.reply({ text: '*Unable to find an article in this topic!*' });
    return await msg.reply({
      text: '*' + json.result.title + '*\n\n_' + (json.result.info?.split('\n')?.join(' ') || json.result.info) + '_\n\n*Read more:*\n' + json.result.url
    });
  }
};
