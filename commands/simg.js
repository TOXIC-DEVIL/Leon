const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');

module.exports = {
  command: 'simg',
  info: 'Converts sticker to image.',
  private: false,
  func: async (sock, msg, text) => {
   if (!msg.replied) return await msg.reply({ text: '*Please reply to any sticker!*' });
   if (!msg.replied.sticker) return await msg.reply({ text: '*Reply to any sticker only!*' });
   if (msg.replied.sticker.isAnimated) return await msg.reply({ text: '*Reply to any non-animated sticker!*' });
   let media = await msg.load(msg.replied.sticker);
   fs.writeFileSync('image.webp', media);

   ffmpeg('image.webp')
    .fromFormat('webp_pipe')
    .save('image.png')
    .on('end', async () => {
     await msg.reply({ image: fs.readFileSync('image.png') });
     fs.unlinkSync('image.webp');
    });
  }
}
