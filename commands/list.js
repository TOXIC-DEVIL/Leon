const { convertTimestamp } = require('../helpers/utils');

module.exports = {
  command: 'list',
  info: 'Shows group\'s participant request list.',
  private: false,
  func: async (sock, msg, text) => {
    if (!msg.isGroup) return await msg.reply({ text: '*This command can only be used in group!*' });
    if (!(await msg.isAdmin(msg.me))) return await msg.reply({ text: '*I am not an admin of this group!*' });
    let list = await sock.groupRequestParticipantsList(msg.chat);
    if (list.length < 1) return await msg.reply({ text: '*There is no join requests!*' });
    let listText = '*Group join requests:*\n';
    list.map(async (info, index) => {/*
      if (index % 10 === 0) {
        await msg.reply({ text: listText });
        listText = '';
      } */
      let t = convertTimestamp(info.request_time);
      listText += `_User_ : *${'@' + info.jid.split('@')[0]} ( ${info.jid} )*\n_Number_ : *${'+' + info.jid.split('@')[0]}*\n_Requested method_ : ${info.request_method == 'invite_link' ? '*Invitation link*' : '*Added by @' + info.requestor.split('@')[0] + '*'}\n_Requested Time_ : *${t.day + ', ' + t.date + ' ' + t.month + ', ' + t.year + ' ' + t.time}*\n\n`;
    });
    // if (listText !== '')
    return await msg.reply({ text: listText });
  }
};
