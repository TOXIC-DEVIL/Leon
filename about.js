module.exports = {
  command: 'about',
  info: 'says information about the bot.',
  private: false,
  func: async (sock, msg, text) => {
    return await msg.reply({ text: '*Hi, i am leon i was created by ToxicDevil. Thanks to Toxic Devil,OnlyBard and Safwan Ganz to giving me new feature*'}); 
  }
};
