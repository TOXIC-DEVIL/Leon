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
     let img = await msg.load(msg.replied.image);
     return await msg.reply({
       image: img,
       caption: msg.replied.image?.caption || '',
       mentions
     });
    } else if (msg.replied && msg.replied.video) {
     let vid = await msg.load(msg.replied.video);
     return await msg.reply({
       video: vid,
       caption: msg.replied.video?.caption || '',
       mentions
     });
    } else if (msg.replied && msg.replied.audio) {
     let aud = await msg.load(msg.replied.audio);
     return await msg.reply({
       audio: aud,
       ptt: msg.replied.audio?.ptt || false,
       mentions
     });
    } else if (msg.replied && msg.replied.document) {
     let doc = await msg.load(msg.replied.document);
     return await msg.reply({
       document: doc,
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
