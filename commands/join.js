module.exports = {
  command: 'join',
  info: 'Joins the group with given link.',
  private: true,
  func: async (sock, msg, text) => {
    let link = text !== '' ? text : msg.replied.text ? msg.replied.text : false;
    if (!link) return await msg.reply({ text: '*Please enter or reply to any WhatsApp group link to join!*' });
    if (!/https:\/\/chat\.whatsapp\.com\/([^\/]+)/.test(link)) return await msg.reply({ text: '*Invalid group link, Enter or reply to any valid group invitation link!*' });
    let id = await sock.groupAcceptInvite(
        link.match(/https:\/\/chat\.whatsapp\.com\/([^\/]+)/)[1]
    ).catch(async (e) => {
      return await msg.reply({ text: '*I am restricted to join because I am removed from there.*' });
    });
    return await msg.reply({ text: '*Successfully joined to:*\n```' + id + '```' });
  }
};
