const { RsnChat } = require('rsnchat');
let ai = new RsnChat('rsnai_1WZBGHRi6kA4cjyKNrZTuEVY');

module.exports = {
  command: 'gemini',
  info: 'Gemini is a multimodal AI (LLM) developed by Google.',
  private: false,
  func: async (sock, msg, text) => {
    text = !text ? 'Hello' : text;
    let result = ai.gemini(text).then((response) => response?.message?.trim());
    return await msg.reply({ text: result });
  }
};
