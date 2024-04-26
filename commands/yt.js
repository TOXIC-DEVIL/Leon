const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'yt',
  info: 'Fetch channel information from YouTube for given name or handler.',
  private: false,
  func: async (sock, msg, text) => {
   if (msg.command == 'yts') return;
   if (!text) return await msg.reply({ text: '*Please enter a YouTube channel\'s name or handler!*' });
   try {
    let { result } = await parseJson('https://toxicdevilapi.vercel.app/stalk/youtube?channel=' + text);
    await msg.reply({
      image: {
        url: result[0].profile_pic
      },
      caption: '_Name_ : *' + result[0].title + '*\n_Handler_ : *' + result[0].handler + '*\n_Subscribers_ : *' + result[0].subscribers + '( ' + result[0].subscribers_text + ' )*\n_URL_ : ' + result[0].url });
    });
   } catch {
    return await msg.reply({ text: '*Unable to find a channel in this name!*' });
   }
  }
};
