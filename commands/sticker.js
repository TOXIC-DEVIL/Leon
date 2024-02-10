const { toSticker } = require('../helpers/sticker');

module.exports = {
  command: 'sticker',
  info: 'Converts image or video to sticker.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.replied || !msg.replied.image && !msg.replied.video) return await msg.reply({ text: '*Please reply to any video or image!*' });
    let media = await msg.load(msg.replied.image ? msg.replied.image : msg.replied.video);
    await msg.reply({ text: '*Converting to sticker...*' });
    let webp = await toSticker(
      msg.replied.image ? 'image' : 'video',
      media, {
        packname: text !== '' && text.includes('/') ? text.split('/')[0].trim() : '',
        author: text !== '' && text.includes('/') ? text.split('/')[1].trim() : 'Leon'
      }
    );
    return await msg.reply({ sticker: webp });
  }
};
