module.exports = {
  command: 'unmute',
  info: 'Everyone can send messages mode.',
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in group!*' });
    if (!(await msg.isAdmin(msg.me))) return await msg.reply({ text: '*I am not an admin of this group!*' });
    await sock.groupSettingUpdate(msg.chat, 'not_announcement');
    return await msg.reply({ text: '*Group unmuted!*' });
  }
};
