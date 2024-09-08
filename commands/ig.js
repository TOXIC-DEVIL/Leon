const { instagram } = require('../helpers/ig');

module.exports = {
  command: 'ig',
  info: 'Downloads instagram post/reels from given url.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter instagram post, or reels url!*' });
    await instagram(text)
     .then(async (result) => {
      if (!result || result.data.length < 1) return await msg.reply({ text: '*Invalid url, Please enter a valid instagram post/reels url!*' });
      for (let data of result.data) {
        await msg.reply({ 
          [(data.match(/jpg|png|jpeg/) ? 'image' : 'video')]: {
            url: data
          }
        });
      }
    });
  }
};
