module.exports = {
  command: 'tagadmin',
  info: 'Tags or mentions all admins of the group.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in groups!*' });
    let group = await sock.groupMetadata(msg.chat);
    let mentions = group.participants.map((user) => (
      user.admin == 'admin' || user.admin == 'superadmin' ? user.id : null
    )).filter(user => user != null);
    return await msg.reply({
      text: '```@' + mentions.join('\n@').replace(/@s.whatsapp.net/g, '') + '```',
      mentions: mentions
    });
  }
}
