const { Users } = require('../index');

module.exports = {
  command: 'bc',
  info: 'Broadcasts replied message to all users.',
  private: true,
  func: async (sock, msg, text) => {
    if (!msg.replied) return await msg.reply({ text: '*Please reply to any message!*' });
    let users = await Users.findAll();
    let replied = true;
    users.map(async (user) => {
      let mesaj = !msg.replied.text ? await msg.load(msg.replied.image || msg.replied.video || msg.replied.audio || msg.replied.sticker || msg.replied.document) : msg.replied.text;
      await new Promise(resolve => setTimeout(resolve, 3000));
      if (msg.replied.image) {
        await sock.sendMessage(user.id, { image: mesaj, mimetype: msg.replied.image.mimetype, caption: msg.replied.image.caption });
      } else if (msg.replied.video) {
        await sock.sendMessage(user.id, { video: mesaj, mimetype: msg.replied.video.mimetype, caption: msg.replied.video.caption });
      } else if (msg.replied.audio) {
        await sock.sendMessage(user.id, { audio: mesaj, mimetype: msg.replied.audio.mimetype, ptt: (text.toLowerCase() == 'ptt' || text.toLowerCase() == 'voice' || text.toLowerCase() == 'voicenote' || text.toLowerCase() == 'voice note') ? true : msg.replied.audio.ptt });
      } else if (msg.replied.sticker) {
        await sock.sendMessage(user.id, { sticker: mesaj, mimetype: msg.replied.sticker.mimetype });
      } else if (msg.replied.text) {
        await sock.sendMessage(user.id, { text: mesaj });
      } else {
        replied = false;
        return;
      }
    });
    if (!replied) {
      return await msg.reply({ text: '*Replied message cannot be broadcasted!*' });
    } else {
      return await msg.reply({ text: '*Successfully broadcasted replied message to ' + users.length + ' chats!*' });
    }
  }
};
