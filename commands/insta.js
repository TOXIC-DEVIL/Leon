const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'insta',
  info: 'Fetch instagram user information from username.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter any instagram username!*' });
    let res;
    try {
     res = await parseJson('https://toxicdevilapi.vercel.app/stalk/instagram?username=' + text);
     return await msg.reply({
      image: { url: res.result.profile?.hd || res.result.profile.sd },
      caption: `_Username_ : *${res.result.username}*\n${res.result?.name?.trim() == undefined ? '' : '_Name_ : *'+res.result?.name?.trim()+'*\n'}${res.result?.bio?.trim() == undefined ? '' : '_Biography_ : *'+res.result?.bio?.trim()+'*\n'}_Account Type_ : *${res.result.privateAccount == true ? 'private' : 'public'}*\n_Followers_ : *${res.result.followers}*\n_Following_ : *${res.result.following}*\n_Posts_ : *${res.result.posts}*`
     });
    } catch (e) {
     return await msg.reply({ text: '*Invalid username, enter a valid instagram username!*' });
    }
  }
};
