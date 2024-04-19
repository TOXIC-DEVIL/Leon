let { ai } = require('../helpers/ai');

module.exports = {
  command: 'imagine',
  info: 'Generates image using OpenAI DALL-E from given prompt.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter any prompt to generate image!*\n\n*Example:*\n*- Dramatic tones, antique small toy pikachu on dirt road, vintage aesthetic*\n*- Dead Angel Bloody Wings Scary Face , high contast hdr, fog, HDR, super resolution, dazzling colors, cinematic light, dramatic lighting*' });
    let image = await ai('dalle', text);
    if (!image) return await msg.reply({ text: '*❌ Unable to generate image for given prompt!*\n_This may be because of invalid prompt or not-safe-for-work prompt._' });
    return await msg.reply({ image: { url: image } });
  }
};
