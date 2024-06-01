const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'font',
  info: 'Apply font to the replied text message.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.replied || !msg.replied.text) return await msg.reply({ text: '*Please reply to any text message!*' });
    try {
      let json = await parseJson('https://toxicdevilapi.vercel.app/other/font?text=' + msg.replied.text);
      let fonts = Object.keys(json.result);
      let font_values = Object.values(json.result);
      let result = '';
      if (!text) {
        fonts.forEach(async (name, i) =>
           result += '_' + (i + 1) + '. ' + name + ':_\n' + font_values[i] + '\n\n'
        );
      } else if (!isNaN(text)) {
        result += (parseInt(text - 1) > 0 || parseInt(text - 1) <= 30) ? font_values[parseInt(text - 1)] : '*❌ A font is not available in this index number.*';
      } else {
        result += '*❌ Invalid index number, Please enter the number which is along with the font!*';
      }
      return await msg.reply({ text: result });
    } catch (e) {
      console.error('Font Command Error:', e);
      return await msg.reply({ text: '*Unable to apply font to the replied text message!*' });
    }
  }
}
