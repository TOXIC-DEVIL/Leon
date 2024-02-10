module.exports = {
  command: 'poll',
  info: 'Creates a poll from given title and options.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter the title and options by splitting with | symbol!*\n\n*Example:*\n*- ' + (process.env?.PREFIX || '/') + 'poll title|option1|option2|option3*' });
    if (!/|/.test(text)) return await msg.reply({ text: '*Invalid format, enter the title and options by splitting with | symbol!*\n\n*Example:*\n*- ' + (process.env?.PREFIX || '/') + 'poll title|option1|option2|option3*' });
    if (text.split('|').length < 2) return await msg.reply({ text: '*There should be atleast 2 options for the poll.*' });
    return await msg.reply({ poll: { title: text.split('|')[0], options: text.split('|').shift() } });
  }
};
