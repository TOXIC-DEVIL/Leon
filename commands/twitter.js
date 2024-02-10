const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'twitter',
  info: 'Download image or video fron twitter.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter any twitter image or video url!*' });
    let json = await parseJson('https://toxicdevilapi.vercel.app/downloader/twitter?url=' + text);
    if (!json.status) return await msg.reply({ text: '*Invalid url, enter a valid twitter image or video url!*' });
    let type = json.result.url.hd.includes('mp4') ? 'video' : 'image';
    await msg.reply({ text: '*Downloading ' + type + '...*' });

    return await msg.reply({
      [type]: {
        url: json.result.url.hd
      },
      thumbnail: json.result.thumbnail,
      caption: json.result.caption
    });
  }
};
