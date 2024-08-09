module.exports = {
  command: 'alive',
  info: 'Checks whether the bot is alive or not.',
  private: false,
  func: async (sock, msg, text) => {
    return await msg.reply({ text: '*Hey, I am still alive!*' });
  }
};
