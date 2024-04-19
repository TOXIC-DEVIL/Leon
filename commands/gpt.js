const { ai } = require('../helpers/ai');

module.exports = {
  command: 'gpt',
  info: 'ChatGPT is a generative AI developed by OpenAI.',
  private: false,
  func: async (sock, msg, text) => {
    let result = await ai('chatgpt', text || 'Hi');
    return await msg.reply({ text: result });
  }
};
