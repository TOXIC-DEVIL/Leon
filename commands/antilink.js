const { enable, status, disable } = require('../helpers/database/toggle');

module.exports = {
  command: 'antilink',
  info: 'Enable/Disable antilink for the chat.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*❌ This command can only be used in groups!*' });
    if (!(await msg.isAdmin(msg.sender)) && !msg.fromBot) return await msg.reply({ text: '*You are not an admin of this group!*' });
    if (!(await msg.isAdmin(msg.me))) return await msg.reply({ text: '*I am not an admin of this group!*' });
    if (!text) return await msg.reply({ text: '*Please enter an argument - \'on\' or \'off\'!*' });
    text = text.toLowerCase();
    let current = await status('antilink', msg.chat);
    if (/on|enable/.test(text)) {
      if (current == true) return await msg.reply({ text: '*✅ Antilink is already turned on!*' });
      await enable('antilink', msg.chat);
      return await msg.reply({ text: '*✅ Successfully turned on antilink for this chat!*' });
    } else if (/off|disable/.test(text)) {
      if (current == false) return await msg.reply({ text: '*☑️ Antilink is already turned off!*' });
      await disable('antilink', msg.chat);
      return await msg.reply({ text: '*☑️ Successfully turned off antilink for this chat!*' });
    } else {
      return await msg.reply({ text: '*❌ Invalid argument, Please enter an argument - \'on\' or \'off\'!*' });
    }
  },
  event: async (sock, msg) => {
    let antilink = await status('antilink', msg.chat);
    if (antilink == true && msg.isGroup && (/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/).test(msg.text)) {
      if (!(await msg.isAdmin(msg.sender)) && (await msg.isAdmin(msg.me)) == true) {
        await msg.reply({ text: '*❌ Links are not allowed in this group!*' });
        await msg.reply({ delete: msg });
      }
    }
  }
};
