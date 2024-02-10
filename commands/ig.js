const { instagram } = require('../helpers/ig');

module.exports = {
  command: 'ig',
  info: 'Downloads instagram post/reels/stories from given url.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter instagram post, reels or story url!*' });
    await instagram(text)
     .then(async (result) => {
      if (!result.status) return await msg.reply({ text: '*Invalid url, Please enter a valid instagram post/reels/story url!*' });
      for (let ig of result.data) {
        if (ig.type == 'image') {
          return await msg.reply({ image: ig.url });
        } else {
          return await msg.reply({ video: ig.url });
        }
      }
    }).catch(async (e) => {
       return await msg.reply({ text: '*Currently unavailable!*' });
    })
  }
};
