const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'threads',
  info: 'Download image or video fron threads.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter any threads image or video url!*' });
    let json = await parseJson('https://toxicdevilapi.vercel.app/downloader/threads?url=' + text);
    if (!json.status) return await msg.reply({ text: '*Invalid url, enter a valid threads image or video url!*' });
    await msg.reply({ text: '*Downloading ' + (json.result.type == 'photo' ? 'image' : 'video') + '...*' });

    return await msg.reply({
      [json.result.type == 'photo' ? 'image' : 'video']: { 
        url: json.result.url
      },
      caption: '*' + json.result.caption + '*'
    });
  }
};
