const { Users } = require('../index');
const { convertTimestamp } = require('../helpers/utils');

module.exports = {
  command: 'profile',
  info: 'Gets profile information of replied or mentioned user.',
  private: false,
  func: async (sock, msg, text) => {
    let chat = msg.replied ? msg.replied.sender : msg.mentions.length > 0 ? msg.mentions[0] : msg.chat;
    let name, about, pp, id, number;
    if (chat.includes('whatsapp')) {
      us = await Users.findAll({ where: { id: chat } });
      if (us.length < 1) name = await sock.getName(chat);
      else name = us[0].name;
      try {
        pp = await sock.profilePictureUrl(chat, 'image');
      } catch {
        pp = 'https://i.ibb.co/1n5F37j/avatar-contact.png';
      }
      about = (await sock.fetchStatus(chat))?.status || 'Unknown';
      id = String(chat);
      number = id.split('@')[0]
      link = 'https://wa.me/' + number;
      return await msg.reply(
        { 
          image: { url: pp },
          caption: `_Name_ : *${name} ( ${'@' + chat.split('@')[0]} )*\n_About_ : *${about}*\n_ID_ : *${id}*\n_Number_ : *${number}*\n_Chat_ : *${link}*`
        }
      );
    } else if (chat.includes('us')) {
      let info = await sock.groupMetadata(msg.chat);
      let ts = await convertTimestamp(info.creation);
      try {
        pp = await sock.profilePictureUrl(chat, 'image');
      } catch {
        pp = 'https://i.ibb.co/1n5F37j/avatar-contact.png';
      }
      await msg.reply(
        {
          image: { url: pp }, 
          caption: `_Name_ : *${info.subject}*\n_ID_ : *${info.id}*\n_Group owner_ : *${'@'+info.owner.split('@')[0]}*\n_Group created_ : *${ts.day}, ${ts.date} ${ts.month} ${ts.year}, ${ts.time}*\n_Participants_ : *${info.size}*\n_Members_ : *${info.participants.filter((p) => p.admin == null).length}*\n_Admins_ : *${Number(info.participants.length - info.participants.filter((p) => p.admin == null).length)}*\n_Who can send message_ : *${info.announce == true ? 'Admins' : 'Everyone'}*\n_Who can edit group info_ : *${info.restrict == true ? 'Admins' : 'Everyone'}*\n_Who can add participants_ : *${info.memberAddMode == true ? 'Everyone' : 'Admins'}*`
        }
      );
    }
  }
};
