const { ai } = require('../helpers/ai');

module.exports = {
  command: 'gemini',
  info: 'Gemini is a multimodal AI (LLM) developed by Google.',
  private: false,
  func: async (sock, msg, text) => {
    let result = await ai('gemini', text || 'Hello');
    return await msg.reply({ text: result });
  }
};
