const { WA_DEFAULT_EPHEMERAL } = require('@whiskeysockets/baileys');

module.exports = {
  command: 'ephemeral',
  info: 'Manage disappearing message in this chat.',
  private: false,
  func: async (sock, msg, text) => {
    if (msg.isGroup && (!(await msg.isAdmin(msg.me)))) return await msg.reply({ text: '*I am not an admin of this group!*' });
    let duration = text !== '' ? (text.includes('7') ? WA_DEFAULT_EPHEMERAL : text.includes('24') ? 86400 : text.includes('90') ? 7776000 : text.match(/off|disable/) ? false : WA_DEFAULT_EPHEMERAL) : WA_DEFAULT_EPHEMERAL;
    await sock.sendMessage(msg.chat, { disappearingMessagesInChat: duration });
    return await msg.reply({ text: `*Ephemeral ${duration == WA_DEFAULT_EPHEMERAL ? 'enabled for 7 days duration' : duration == 86400 ? 'enabled for 24 hours duration' : duration == 7776000 ? 'enabled for 90 days duration' : 'disabled for this chat'}!*` });
  }
};
