const { getContentType, generateWAMessageContent, generateForwardMessageContent, waUploadToServer, downloadContentFromMessage, jidDecode } = require('@whiskeysockets/baileys');
const fs = require('fs');

module.exports = async (msg, sock, store) => {
 if (msg.key) {
  msg.me = sock.user.id.includes(':') ? sock.user.id.split(':')[0]+'@s.whatsapp.net' : sock.user.id;
  msg.chat = msg.key.remoteJid
  msg.id = msg.key.id
  msg.fromMe = msg.key.fromMe
  msg.isGroupChat = msg.isGroup = msg.key.remoteJid.endsWith('g.us')
  msg.isPrivateChat = msg.isPrivate = msg.key.remoteJid.endsWith('.net')
  msg.sender = msg.from = msg.fromMe ? msg.me : msg.isGroupChat ? msg.key.participant : msg.chat
  msg.fromBot = msg.isBaileys = msg.sender === msg.me
  if (msg.isGroupChat) msg.participant = msg.key.participant
}
if (msg.message) {
 msg.mtype = getContentType(msg.message)
 msg.text = (msg.mtype === 'conversation') ? msg.message.conversation : (msg.mtype == 'imageMessage') ? msg.message.imageMessage.caption : (msg.mtype == 'videoMessage') ? msg.message.videoMessage.caption : (msg.mtype == 'extendedTextMessage') ? msg.message.extendedTextMessage.text : (msg.mtype == 'buttonsResponseMessage') ? msg.message.buttonsResponseMessage.selectedButtonId : (msg.mtype == 'listResponseMessage') ? msg.message.listResponseMessage.singleSelectReply.selectedRowId : (msg.mtype == 'templateButtonReplyMessage') ? msg.message.templateButtonReplyMessage.selectedId : (msg.mtype === 'messageContextInfo') ? (msg.message.buttonsResponseMessage?.selectedButtonId || msg.message.listResponseMessage?.singleSelectReply.selectedRowId || msg.msg) : ''
 msg.msg = (msg.mtype == 'viewOnceMessage' ? msg.message[msg.mtype].message[getContentType(msg.message[msg.mtype].message)] : msg.message[msg.mtype])
 msg.replied = msg.msg?.contextInfo ? msg.msg.contextInfo.quotedMessage : false
 msg.mentions = msg.msg?.contextInfo ? msg.msg.contextInfo.mentionedJid : []
 msg.command = (msg.text.includes(' ') ? msg.text.split(' ')[0] : msg.text).replace(msg.text.charAt(0), '')
 if (msg.replied) {
  msg.replied.id = msg.msg.contextInfo.stanzaId || false
  msg.replied.chat = msg.msg.contextInfo.remoteJid || msg.chat
  msg.replied.fromBot = msg.replied.isBaileys = msg.replied.id ? msg.replied.id.startsWith('BAE5') && msg.replied.id.length === 16 : false
  msg.replied.sender = msg.replied.from = msg.msg.contextInfo.participant || false
  msg.replied.mentions = msg.msg.contextInfo ? msg.msg.contextInfo.mentionedJid : []
  msg.replied.fromMe = msg.replied.me = msg.replied.sender === msg.me
  msg.replied.mtype = getContentType(msg.replied)
  msg.replied.viewonce = msg.replied?.viewOnceMessage?.message || msg.replied?.viewOnceMessageV2?.message || msg.replied?.viewOnceMessageV2Extension?.message || false
  msg.replied.text = msg.replied.text || msg.replied.caption || msg.replied.conversation || msg.replied.contentText || msg.replied.selectedDisplayText || msg.replied.title || false
  msg.replied.image = msg.replied.viewonce?.imageMessage || msg.replied.imageMessage || false
  msg.replied.video = msg.replied.viewonce?.videoMessage || msg.replied.videoMessage || false
  msg.replied.audio = msg.replied.viewonce?.audioMessage || msg.replied.audioMessage || false
  msg.replied.sticker = msg.replied.stickerMessage || false
  msg.replied.document = msg.replied.documentMessage || false
 }
}
msg.isOwner = msg.sender === msg.me
/**
 * @typedef {Object} awaitMessageOptions
 * @property {Number} [timeout] - The time in milliseconds to wait for a message
 * @property {String} sender - The sender to wait for
 * @property {String} chatJid - The chat to wait for
 * @property {(message: Baileys.proto.IWebMessageInfo) => Boolean} [filter] - The filter to use
 */
/**
 * 
 * @param {awaitMessageOptions} options 
 * @returns {Promise<Baileys.proto.IWebMessageInfo>}
 */
sock.awaitMessage = async (options = {}) => {
  return new Promise((resolve, reject) => {
    if (typeof options !== 'object') reject(new Error('Options must be an object'));
    if (typeof options.sender !== 'string') reject(new Error('Sender must be a string'));
    if (typeof options.chatJid !== 'string') reject(new Error('ChatJid must be a string'));
    if (options.timeout && typeof options.timeout !== 'number') reject(new Error('Timeout must be a number'));
    if (options.filter && typeof options.filter !== 'function') reject(new Error('Filter must be a function'));

    const timeout = options?.timeout || undefined;
    const filter = options?.filter || (() => true);
    let interval = undefined;

    /**
     * 
     * @param {{messages: Baileys.proto.IWebMessageInfo[], type: Baileys.MessageUpsertType}} data 
     */
    let listener = (data) => {
      let { type, messages } = data;
      if (type === 'notify') {
        for (let message of messages) {
          const fromMe = message.key.fromMe;
          const chatId = message.key.remoteJid;
          const isGroup = chatId.endsWith('@g.us');
          const isStatus = chatId === 'status@broadcast';

          const sender = fromMe ? socket.user.id.replace(/:.*@/g, '@') : (isGroup || isStatus) ? message.key.participant.replace(/:.*@/g, '@') : chatId;
          if (sender === options.sender && chatId === options.chatJid && filter(message)) {
            sock.ev.off('messages.upsert', listener);
            clearTimeout(interval);
            resolve(message);
          }
        }
      }
    };
    
    sock.ev.on('messages.upsert', listener);
    
    if (timeout) {
      interval = setTimeout(() => {
        sock.ev.off('messages.upsert', listener);
        reject(new Error('Timeout'));
      }, timeout);
    }
  });
}
msg.reply = async (message, options, jid = msg.chat) => {
 await new Promise(resolve => setTimeout(resolve, 1000));
 if (message.hasOwnProperty('text')) {
  return await sock.sendMessage(jid, { text: message.text, mentions: (await msg.getMentions(message.text)), ...message}, { quoted: msg, ...options});
 } else if (message.hasOwnProperty('image')) {
  return await sock.sendMessage(jid, { image: message.image, caption: (message?.caption || ''), mimetype: (message?.mimetype || 'image/png'), thumbnail: Buffer.alloc(0), mentions: (await msg.getMentions(message?.caption)), ...message }, { quoted: msg, ...options });
 } else if (message.hasOwnProperty('video')) {
  return await sock.sendMessage(jid, { video: message.video, caption: (message?.caption || ''), mimetype: (message?.mimetype || 'video/mp4'), thumbnail: Buffer.alloc(0), mentions: (await msg.getMentions(message?.caption)), ...message }, { quoted: msg, ...options });
 } else if (message.hasOwnProperty('audio')) {
  return await sock.sendMessage(jid, { audio: message.audio, ptt: (message?.ptt || false), mimetype: (message?.mimetype || 'audio/mpeg'), waveform: Array(40).fill().map(() => Math.floor(Math.random() * 99)), ...message }, { quoted: msg, ...options });
 } else if (message.hasOwnProperty('document')) {
  return await sock.sendMessage(jid, { document: message.document, caption: (message?.caption || ''), mimetype: (message?.mimetype || 'application/pdf'), mentions: (await msg.getMentions(message?.caption)), ...message }, { quoted: msg, ...options });
 } else if (message.hasOwnProperty('sticker')) {
  return await sock.sendMessage(jid, { sticker: message.sticker, mimetype: (message?.mimetype || 'image/webp'), ...message }, { quoted: msg, ...options });
 } else if (message.hasOwnProperty('poll')) {
  return await sock.sendMessage(jid, { poll: { name: message.poll.title, values: message.poll.options }, mentions: (await msg.getMentions(message.title + '\n' + String(message.poll.options))), ...message }, { quoted: msg, ...options });
 } else if (message.hasOwnProperty('delete')) {
  return await sock.sendMessage(jid, { delete: message.delete.key });
 } else if (message.hasOwnProperty('edit')) {
  return await sock.relayMessage(jid, { protocolMessage: { key: message.edit.key, type: 14, editedMessage: { conversation: message.edit.text, mentions: (await msg.getMentions(message.edit.text)) } }, }, {});
 }
}
msg.isAdmin = async (who) => {
 let group = await sock.groupMetadata(msg.chat);
 let participant = group.participants.filter(p => p.id == who);
 if (participant.length != 0) return (participant[0].admin === 'superadmin' || participant[0].admin === 'admin') ? true : false;   
 else return false;
}
msg.isParticipant = async (who, chat = msg.chat) => {
 let group = await sock.groupMetadata(chat);
 let participant = group.participants.filter(p => p.id == who);
 if (participant.length == 0) return false;
 return true;
}
msg.getMentions = async (message) => {
 let mentions = [];
 try { 
   mentions = [...message.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net');
 } catch {
   mentions = [];
 }
 return mentions;
}
msg.load = async (message) => {
 let mime = (message.msg || message).mimetype || ''
 let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]
 let stream = await downloadContentFromMessage(message, messageType);
 let buffer = Buffer.from([]);
 for await(let chunk of stream) {
   buffer = Buffer.concat([buffer, chunk]);
 }
 return buffer;
}
sock.getName = async (id) => {
   id = id.toString();
   if (id.endsWith('net')) {
   if (id == sock.user.id) return sock.user.name;
   let s = store.contacts[id]
   try { s = s.name } catch { s = '+'+id.split('@')[0] }
   return s;
  } else {
   return id;
  }
 }
 return msg;
}
