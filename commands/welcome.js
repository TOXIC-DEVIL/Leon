const { setMessage, getMessage, deleteMessage } = require('../helpers/database/greetings');

module.exports = {
  command: 'welcome',
  info: 'Sets or deletes welcome message.',
  private: true,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in group!*' });
    let message = text !== '' ? text : msg.replied.text ? msg.replied.text : false
    let wtext = await getMessage('welcome', msg.chat);
    if (!message) return await msg.reply({ text: '*Please enter or reply to any message to set as welcome message!*' + (wtext == false ? '' : '\n*Welcome message:*\n'+wtext+'\n\n_Type \'delete\' or \'remove\' along with the command to delete welcome message!_') });
    if (message.toLowerCase() == 'delete' || message.toLowerCase() == 'remove') {
      await deleteMessage('welcome', msg.chat);
      return await msg.reply({ text: '*Successfully deleted welcome message from this chat!*' });
    }
    await setMessage('welcome', msg.chat, message);
    return await msg.reply({ text: '*Successfully set welcome message!*\n_Type \'delete\' or \'remove\' along with the command to delete the welcome message._' });
  }
}
