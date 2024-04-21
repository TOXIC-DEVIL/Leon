const { RsnChat } = require('rsnchat');
let ai = new RsnChat('rsnai_1WZBGHRi6kA4cjyKNrZTuEVY');

module.exports = {
  command: 'gpt',
  info: 'ChatGPT is a generative AI developed by OpenAI.',
  private: false,
  func: async (sock, msg, text) => {
    let result = ai.gpt((response) => response.message.trim());
    return await msg.reply({ text: result });
  }
};
