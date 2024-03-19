const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'dict',
  info: 'Searches defenition for your word in dictionary.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter any word!*' });
    try {
      let data = await parseJson(`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`);
      let word = data.word;
      let phonetics = data.phonetics[0].text;
      let partsOfSpeech = data.meanings[0].partOfSpeech;
      let definition = data.meanings[0].definitions[0].definition;
      let example = (data.meanings[0].definitions.find(obj => 'example' in obj) || {})['example'];
      return await msg.reply({ text: `_Word_ : *${word}*\n_Parts of speech_ : *${partsOfSpeech}*\n_Definition_ :\n*${definition}*${example == undefined ? `` : `\n_Example_ : *${example}*`}` });
    } catch {
      return await msg.reply({ text: '*Unable to find defenition for ' + text + '!*' });
    }
  }
};
