const { RsnChat } = require('rsnchat');
let ai = new RsnChat('rsnai_1WZBGHRi6kA4cjyKNrZTuEVY');

module.exports = {
  command: 'gpt',
  info: 'ChatGPT is a generative AI developed by OpenAI.',
  private: false,
  func: async (sock, msg, text) => {
    text = !text ? 'Hello' : text;
    let result = ai.gpt(text).then((response) => response?.message?.trim());
    return await msg.reply({ text: result });
  }
};
