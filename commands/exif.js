const { toSticker, addExif, getExif } = require('../helpers/sticker');

module.exports = {
  command: 'exif',
  info: 'Set exif to a sticker.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.replied || !msg.replied.sticker && !msg.replied.image && !msg.replied.video) return await msg.reply({ text: '*Please reply to any sticker!*' });
    let [packname, author] = text.split('/');
    let sticker = null;
    if (msg.replied.image || msg.replied.video) {
      sticker = await toSticker(
        msg.replied.image ? 'image' : 'video',
        await msg.load(msg.replied.image ? msg.replied.image : msg.replied.video),
        { packname, author }
      );
      return await msg.reply({ sticker: sticker });
    } else if (msg.replied.sticker) {
      let media = await msg.load(msg.replied.sticker);
      if (!packname && !author) {
        let exif = await getExif(media);
        return await msg.reply({ text: '_Sticker Packname_ : *' + exif.packname + '*\n_Sticker Author_ : *' + exif.author + '*\n\n*Please enter packname and author name along with replying to a sticker to change its exif.*' });
      } else {
        let sticker = await addExif(media, { packname, author });
        return await msg.reply({ sticker: sticker });
      }
    }
  }
};
