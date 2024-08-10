module.exports = {
  command: 'tagall',
  info: 'Tags or mentions all participants of the group.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in groups!*' });
    if (msg.sender !== msg.me && (!(await msg.isAdmin(msg.sender)))) return await msg.reply({ text: '*You are not an admin!*' });
    let group = await sock.groupMetadata(msg.chat);
    let mentions = group.participants.map((user) => user.id);
    if (text || msg.replied.text) {
     return await msg.reply({
       text: text || msg.replied.text,
       mentions
     });
    } else if (msg.replied && msg.replied.image) {
     return await msg.reply({
       video: await msg.load(msg.replied.image),
       caption: msg.replied.image?.caption || '',
       mentions
     });
    } else if (msg.replied && msg.replied.video) {
     return await msg.reply({
       video: await msg.load(msg.replied.video),
       caption: msg.replied.video?.caption || '',
       mentions
     });
    } else if (msg.replied && msg.replied.audio) {
     return await msg.reply({
       video: await msg.load(msg.replied.audio),
       ptt: msg.replied.audio?.ptt || false,
       mentions
     });
    } else if (msg.replied && msg.replied.document) {
     return await msg.reply({
       video: await msg.load(msg.replied.document),
       caption: msg.replied.document?.caption || '',
       mimetype: msg.replied.document.mimetype,
       mentions
     });
    } else {
     return await msg.reply({
       text: '```@' + mentions.join('\n@').replace(/@s.whatsapp.net/g, '') + '```',
       mentions: mentions
     });
    }
  }
}
