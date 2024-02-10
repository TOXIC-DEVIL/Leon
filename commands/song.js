const fs = require('fs');
const { parseJson } = require('../helpers/utils');
const ytdl = require('youtubedl-core');

module.exports = {
  command: 'song',
  info: 'Downloads song from given lyric.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter a song lyric!*' });
    text += text.includes('http') ? '' : ' song';
    let mesaj = await msg.reply({ text: '*Searching for song...*' });
    let res = '';
    try {
     let json = await parseJson('https://toxicdevilapi.vercel.app/search/youtube?query=' + text);
     let video = json.result.filter((v) => v.type == 'video')[0].url;
     res = video.split('/').slice(-1)[0].replace('watch?v=', '');
    } catch (e) {
     console.log(e);
     return await msg.reply({ edit: { key: mesaj.key, text: '*Unable to find any song in this lyric!*' } });
    }
    let file = './' + res + '.mp3'
    await msg.reply({ edit: { key: mesaj.key, text: '*Downloading song...*' } });
    try {
     let audio = await ytdl(res, {
      filter: 'audioonly',
      quality: 'highestaudio'
     });
     audio.pipe(fs.createWriteStream(file));
     audio.on('end', async () => {
       await msg.reply({ delete: { key: mesaj.key } })
       await msg.reply({ audio: fs.readFileSync(file) });
     });
   } catch {
     return await msg.reply({ text: '*Unable to download the song!*' });
   }
  }
};
