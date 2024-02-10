const translate = require('translate-google-api');

module.exports = {
  command: 'tr',
  info: 'Translates replied message from auto-dected language to provided language.',
  private: false,
  func: async (sock, msg, text) => {
    if (msg.text.split(' ')[0].includes('trim')) return;
    if (!msg.replied || !msg.replied.text) return await msg.reply({ text: '*Please reply to any text!*' });
    if (!text) return await msg.reply({ text: '*Please enter the language in which you want to translate the text to along with replying to text.*' });
    let result = await translate(msg.replied.text, { tld: 'com', to: text });
    return await msg.reply({ text: result[0] });
  }
};
