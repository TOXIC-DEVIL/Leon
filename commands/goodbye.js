const { setMessage, getMessage, deleteMessage } = require('../helpers/database/greetings');

module.exports = {
  command: 'goodbye',
  info: 'Sets or deletes goodbye message.',
  private: true,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in group!*' });
    let message = text !== '' ? text : msg.replied.text ? msg.replied.text : false
    let gtext = await getMessage('goodbye', msg.chat);
    if (!message) return await msg.reply({ text: '*Please enter or reply to any message to set as goodbye message!*' + (gtext == false ? '' : '\n*Goodbye message:*\n'+gtext+'\n\n_Type \'delete\' or \'remove\' along with the command to delete goodbye message!_') });
    if (message.toLowerCase() == 'delete' || message.toLowerCase() == 'remove') {
      await deleteMessage('goodbye', msg.chat);
      return await msg.reply({ text: '*Successfully deleted goodbye message from this chat!*' });
    }
    await setMessage('goodbye', msg.chat, message);
    return await msg.reply({ text: '*Successfully set goodbye message!*\n_Type \'delete\' or \'remove\' along with the command to delete the goodbye message._' });
  }
}
