module.exports = {
  command: 'viewonce',
  info: 'Converts view once media to standard media for unrestricted viewing and sharing.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.replied.viewonce) return await msg.reply({ text: '*Please reply to any viewonce message!*' });
    if (msg.replied.image) {
      let image = await msg.load(msg.replied.image);
      return await msg.reply({ image: image, mimetype: msg.replied.image.mimetype, caption: msg.replied.image?.caption || '' });
    } else if (msg.replied.video) {
      let video = await msg.load(msg.replied.video);
      return await msg.reply({ video: video, mimetype: msg.replied.video.mimetype, caption: msg.replied.video?.caption || '' });
    } else if (msg.replied.audio) {
      let audio = await msg.load(msg.replied.audio);
      return await msg.reply({ audio: audio, mimetype: msg.replied.audio.mimetype, ptt: msg.replied.audio?.ptt || false });
    } else {
      return await msg.reply({ text: '*❌ Unsupported media, reply to any viewonce image, video or audio!*' });
    }
  }
};
