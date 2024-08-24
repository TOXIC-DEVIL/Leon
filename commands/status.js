const { Users } = require('../index');

module.exports = {
  command: 'status',
  info: 'Updates status with replied media.',
  private: true,
  func: async (sock, msg, text) => {
    if (!text && !msg.replied) return await msg.reply({ text: '*Please enter some text or reply to any image, audio or video to update status!*' });
    let users = await Users.findAll();
    let ids = users.map((user) => user.id);
    if (text || msg.replied.text) {
      await sock.sendStatus({ text: text || msg.replied.text, statusJidList: ids });
    } else if (msg.replied.image) {
      let image = await msg.load(msg.replied.image);
      await sock.sendStatus({ image: image, caption: msg.replied.image?.caption || '', statusJidList: ids });
    } else if (msg.replied.video) {
      let video = await msg.load(msg.replied.video);
      await sock.sendStatus({ video: video, caption: msg.replied.video?.caption || '', statusJidList: ids });
    } else if (msg.replied.audio) {
      let audio = await msg.load(msg.replied.audio);
      await sock.sendStatus({ audio: audio, statusJidList: ids });
    } else {
      return await msg.reply({ text: '*❌ Unsupported media, reply to any image, video or audio!*' });
    }
    return await msg.reply({ text: '*Successfully updated status!*' });
  }
};
