module.exports = {
  command: 'add',
  info: 'Adds user to group from entered number.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in group!*' });
    if (!text && !msg.replied) return await msg.reply({ text: '*Please enter a number with +country code to add!*' });
    if (!(await msg.isAdmin(msg.me))) return await msg.reply({ text: '*I am not an admin of this group!*' });
    if (!(await msg.isAdmin(msg.sender))) return await msg.reply({ text: '*You are not an admin of this group!*' });
    if (msg.replied) {
      let isPart = await msg.isParticipant(msg.replied.sender, msg.chat);
      if (isPart) return await msg.reply({ text: '*@' + msg.replied.sender.split('@')[0] + ' is already a participant of this group!*' });
      await sock.groupParticipantsUpdate(msg.chat, [msg.replied.sender], 'add').then(async (_) => {
       return await msg.reply({ text: '*Added @' + msg.replied.sender.split('@')[0] + '!*' });
      }).catch(async (e) => {
       return await msg.reply({ text: '*@' + msg.replied.sender.split('@')[0] + ' cannot be added because of their privacy settings!*' });
      });
    } else if (text) {
      if (!text.startsWith('+')) return await msg.reply({ text: '*Please enter a number with +country code!*\n\n*For Example:*\n*/add +91 xxxxx xxxxx*\n*/add +91 xxxxxxxxxx*\n*/add +91xxxxxxxxxx*' });
      text = (text.trim().replace('+', '').replace(/ /g, '')) + '@s.whatsapp.net';
      let isPart = await msg.isParticipant(text, msg.chat);
      if (isPart) return await msg.reply({ text: '*@' + text.split('@')[0] + ' is already a participant of this group!*' });
      await sock.groupParticipantsUpdate(msg.chat, [text], 'add').then(async (_) => {
       return await msg.reply({ text: '*Added @' + text.split('@')[0] + '!*' });
      }).catch(async (e) => {
       return await msg.reply({ text: '*@' + text.split('@')[0] + ' cannot be added because of their privacy settings!*' });
      });
    }
  }
};
