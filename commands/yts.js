const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'yts',
  info: 'Searches video in YouTube for give query.',
  private: false,
  func: async (sock, msg, text) => {
   if (!text) return await msg.reply({ text: '*Please enter your query to search in YouTube!*' });
   let mesaj = await msg.reply({ text: '*Searching...*' });
   try {
    let results = await parseJson('https://toxicdevilapi.vercel.app/search/youtube?query=' + text);
    await msg.reply({ delete: mesaj });
    await msg.reply({ text: results.result.filter((v) => v.type == 'video').map((v) => '_Title_ : *' + v.title + '*\n_URL_ : ' + (v.url.replace('watch?v=', '').replace('youtube.com', 'youtu.be')) + '\n_Duration_ : *' + v.timestamp + '*\n_Views_ : *' + v.views + '*\n_Uploaded_ : *' + v.ago + '*\n_Uploaded by_ : *' + v.channel + '*\n_Channel_ : ' + v.channel_url).join('\n\n') });
   } catch {
    return await msg.reply({ text: '*Unable to find results for your query!*' });
   }
  }
};
