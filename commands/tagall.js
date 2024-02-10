module.exports = {
  command: 'tagall',
  info: 'Tags or mentions all participants of the group.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in groups!*' });
    if (msg.sender !== msg.me && !msg.isAdmin(msg.sender)) return await msg.reply({ text: '*You are not an admin!*' });
    let group = await sock.groupMetadata(msg.chat);
    let mentions = group.participants.map((user) => user.id);
    if (!text && !msg.replied.text) {
     return await msg.reply({
       text: '```@' + mentions.join('\n@').replace(/@s.whatsapp.net/g, '') + '```',
       mentions: mentions
     });
    } else {
     return await msg.reply({
       text: text || msg.replied.text,
       mentions
     });
    }
  }
}
