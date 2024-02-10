module.exports = {
  command: 'link',
  info: 'Fetches group\'s invitation link.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in group!*' });
    if (!(await msg.isAdmin(msg.me))) return await msg.reply({ text: '*I am not an admin of this group!*' });
    if (!(await msg.isAdmin(msg.sender))) return await msg.reply({ text: '*You are not an admin of this group!*' });
    return await msg.reply({
      text: 'https://chat.whatsapp.com/' + (await sock.groupInviteCode(msg.chat))
    });
  }
};
