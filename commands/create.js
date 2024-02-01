module.exports = {
  command: 'create',
  info: 'Creates a group with provided name and participants.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter a subject for group!*' });
    let participants = msg.mentions.length > 0 ? msg.mentions : msg.replied && msg.replied.sender !== msg.me ? [msg.replied.sender] : !msg.isGroup ? [msg.chat] : [msg.sender];
    if (!participants.includes(msg.sender)) participants.push(msg.sender);
    text = text.replace(/@(\d+)/g, '').trim();
    let group = await sock.groupCreate(text, participants);
    await sock.groupParticipantsUpdate(group.gid, [msg.sender], 'promote');
    return await msg.reply({ text: '*Successfully created group \'' + text + '\'' });
  }
};
