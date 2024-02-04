module.exports = {
  command: 'revoke',
  info: 'Revokes group\'s invitation link.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in group!*' });
    if (!(await msg.isAdmin(msg.me))) return await msg.reply({ text: '*I am not an admin of this group!*' });
    if (!(await msg.isAdmin(msg.sender))) return await msg.reply({ text: '*You are not an admin of this group!*' });
    await sock.groupRevokeInvite(msg.chat);
    return await msg.reply({ text: '*Group link revoked!*' });
  }
};
