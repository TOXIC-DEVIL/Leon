const { telegraph } = require('../helpers/upload');

module.exports = {
  command: 'url',
  info: 'Uploads image or video to telegraph.',
  private: false,
  func: async (sock, msg) => {
    if (!msg.replied.image && !msg.replied.video) return await msg.reply({ text: '*Please reply to any image or video!*' });
    let media = await msg.load(msg.replied.image ? msg.replied.image : msg.replied.video);
    let url = await telegraph(media);
    await msg.reply({ text: url });
  }
};
