const { RsnChat } = require('rsnchat');
let ai = new RsnChat('rsnai_77URql4VkEeS0VenuWccfgk5');

module.exports = {
  command: 'gpt',
  info: 'ChatGPT is a generative AI developed by OpenAI.',
  private: false,
  func: async (sock, msg, text) => {
    return await ai.gpt(text || 'Hello').then(async (response) => {
      await msg.reply({ text: response?.message?.trim() });
    });
  }
};
