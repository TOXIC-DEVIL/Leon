const { instagram } = require('../helpers/ig');

module.exports = {
  command: 'ig',
  info: 'Downloads instagram post/reels from given url.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter instagram post, or reels url!*' });
    await instagram(text)
     .then(async (result) => {
      if (!result) return await msg.reply({ text: '*Invalid url, Please enter a valid instagram post/reels url!*' });
      for (let media of result) {
        return await msg.reply({ 
          [(!media.includes('mp4') ? 'image' : 'video')]: {
            url: media
          }
        });
      }
    });
  }
};
