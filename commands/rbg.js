const rbg = require('remove.bg').removeBackgroundFromImageFile;
const { RBG_APIKEY } = require('../config');
const fs = require('fs');

module.exports = {
  command: 'rbg',
  info: 'Removes the background of replied image.',
  private: false,
  func: async (sock, msg, text) => {
    if (!RBG_APIKEY) return await msg.reply({ text: '*Provide a valid RBG_APIKEY from https://remove.bg/ to remove background!*' });
    if (!msg.replied) return await msg.reply({ text: '*Please reply to any image!*' });
    if (!msg.replied.image) return await msg.reply({ text: '*Reply to any image only!*' });
    let media = await msg.load(msg.replied.image);
    fs.writeFileSync('image.png', media);
    
    await rbg({ path: 'image.png', apiKey: RBG_APIKEY, size: 'regular', type: 'auto', scale: 'original', outputFile: 'rbg.png' })
    .then(async () => {
      return await msg.reply({ image: fs.readFileSync('rbg.png') });
      fs.unlinkSync('image.png');
      fs.unlinkSync('rbg.png');
    })
    .catch(async () => {
      return await msg.reply({ text: '*Your RBG_APIKEY ran out of limits!*' });
    });
  }
};
