const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

module.exports = {
  command: 'vaud',
  info: 'Converts video to audio.',
  private: false,
  func: async (sock, msg, text) => {
   if (!msg.replied) return await msg.reply({ text: '*Please reply to any video!*' });
   if (!msg.replied.video) return await msg.reply({ text: '*Reply to any video!*' });
   let media = await msg.load(msg.replied.video);
   fs.writeFileSync('video.mp4', media);

   ffmpeg('video.mp4')
    .save('audio.mp3')
    .on('end', async () => {
      await msg.reply({ audio: fs.readFileSync('audio.mp3'), mimetype: 'audio/mpeg' });
      fs.unlinkSync('video.mp4');
    });
  }
}
