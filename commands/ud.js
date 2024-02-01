const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'ud',
  info: 'Searches definition for your term in urban dictionary.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter a term to define!*' });
    text = text.toLowerCase();
    let word, definition, example;
    try {
     let dictionary = await parseJson('https://api.urbandictionary.com/v0/define?term=' + text);
     word = dictionary['list'][0]['word']
     definition = dictionary['list'][0]['definition']
     example = dictionary['list'][0]['example']
    } catch {
     return await msg.reply({ text: '*Unable to find the definition for:*\n```' + text + '```' });
    }
    return await msg.reply({ text: `_Word_ :\n*${word}*\n_Definition_ :\n*${definition.replace(/(\[)|(\])/g, '').replace(/\r\n/g, '*\n*')}*\n_Example_ :\n*${example.replace(/(\[)|(\])/g, '').replace(/\r\n/g, '*\n*')}*` });
  }
};
