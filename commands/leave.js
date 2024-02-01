module.exports = {
  command: 'leave',
  info: 'Leaves from the group.',
  private: true,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in groups!*' });
    await msg.reply({ text: '*Leaving...*' }).then(async () => {
     await sock.groupLeave(msg.chat);
    });
  }
};
