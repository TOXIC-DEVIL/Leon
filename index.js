'use strict';
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore, getContentType, jidNormalizedUser, generateForwardMessageContent, downloadContentFromMessage, jidDecode } = require('@whiskeysockets/baileys');
const { Sequelize, DataTypes } = require('sequelize');
const { list, uninstall } = require('./helpers/database/commands');
const { parseJson } = require('./helpers/utils');
const { database } = require('./helpers/database.js');
const { SESSION, ADMINS, MODE, PREFIX } = require('./config');
const Greetings = require('./helpers/database/greetings');
const axios = require('axios');
const pino = require('pino');
const colors = require('colors');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const Users = database.define('Users', {
    name: {
        primaryKey: true,
        unique: false,
        type: DataTypes.STRING,
        allowNull: false
    },
    id: {
        type: DataTypes.TEXT,
        allowNull: false
    }
});

async function Connect() {
    try {
        let store = makeInMemoryStore({
            logger: pino().child({ level: 'silent', stream: 'store' })
        });

        if (SESSION !== false && !fs.existsSync('./session/creds.json')) {
         try {
          let auth = Buffer.from(SESSION, 'base64').toString();
          fs.writeFileSync(__dirname + '/session/creds.json', auth);
          console.log('[ - ] Creating session file...');
         } catch (e) {
          console.error(e)
          throw new Error('[ ! ] Please provide a valid AUTH_ID');
         }
        }

        let { version, isLatest } = await fetchLatestBaileysVersion();
        let { state, saveCreds } = await useMultiFileAuthState('./session');
        let sock = makeWASocket({
            logger: pino({ level: 'silent' }),
            printQRInTerminal: false,
            markOnlineOnConnect: false,
            browser: ['Leon', 'Chrome', '1.0.0'],
            auth: state,
            version: version,
            patchMessageBeforeSending: (message) => {
              let requiresPatch = !!(message.buttonsMessage || message.listMessage || message.templateMessage)
              if (requiresPatch) {
                message = {
                  viewOnceMessage: {
                    message: {
                      messageContextInfo: {
                       deviceListMetadata: {},
                       deviceListMetadataVersion: 2,
                      },
                      ...message,
                    },
                  },
                }
              }
              return message
            },
            getMessage: async (key) => {
              let jid = jidNormalizedUser(key.remoteJid)
              let msg = await store.loadMessage(jid, key.id)
              return msg?.message || ""
            }
        });
        store.bind(sock.ev);

        sock.ev.on('connection.update', async (update) => {
            const { connection } = update;
            if (connection === 'close') {
                console.log(colors.red('[ ! ] Connection Closed: Reconnecting...'));
                await Connect();
            } else if (connection === 'open') {
                console.log(colors.green('[ + ] Connected!'));
            }
        });

        let extCommands = await list();
        extCommands.forEach(async (cmd) => {
         if (!fs.existsSync('./commands/' + cmd.name + '.js')) {
          try {
           let content = await parseJson(cmd.url);
           fs.writeFileSync('./commands/' + cmd.name + '.js', content);
           require('./commands/' + cmd.name);
          } catch (e) {
           console.log('[ ! ] ' + cmd.name + ' command crashed.');
           console.error(e);
           try {
            fs.unlinkSync('./commands/' + cmd.name + '.js');
           } catch {}
           await uninstall(cmd.name);
           console.log('[ + ] ' + cmd.name + ' command has been removed!');
          }
         }
        });
        if (extCommands.length > 0) {
         console.log('[ + ] Loaded external commands.');
        }

        sock.ev.on('group-participants.update', async (info) => {
           let gc = await sock.groupMetadata(info.id);
           let subject = gc.title, size = gc.size, owner = gc.owner;
           if (info.action == 'add') {
            let wtext = await Greetings.getMessage('welcome', info.id);
            if (wtext !== false) await sock.sendMessage(info.id, {
             text: wtext.replace(/{subject}/g, subject).replace(/{version}/g, require('./package.json').version).replace(/{size}/g, size).replace(/{owner}/g, '@'+owner.split('@')[0]),
             mentions: [owner]
            });
           } else if (info.action == 'remove') {
            let gtext = await Greetings.getMessage('goodbye', info.id);
            if (gtext !== false) await sock.sendMessage(info.id, {
             text: gtext.replace(/{subject}/g, subject).replace(/{version}/g, require('./package.json').version).replace(/{size}/g, size).replace(/{owner}/g, '@'+owner.split('@')[0]),
             mentions: [owner]
            });
           }
        });
 
        sock.ev.on('messages.upsert', async (msg) => {
            msg = msg.messages[0];
            if (!msg.message) return;
            msg = await require('./helpers/message')(msg, sock, store);
            if (msg.chat === 'status@broadcast') return;

            try {
             if (allCommands(msg.command) || msg.isPrivate) {
              let user = await Users.findAll({ where: { id: msg.isPrivate ? msg.chat : msg.sender } });
              if (user.length < 1) {
               await Users.create({ name: msg.pushName, id: msg.isPrivate ? msg.chat : msg.sender });
              } else {
               await Users[0]?.update({ name: msg.pushName });
              }
             }
            } catch {}
    
            let admins = ADMINS !== false ? (ADMINS?.includes(',') ? ADMINS?.split(',').map(admin => admin.trim() + '@s.whatsapp.net') : [ADMINS?.trim() + '@s.whatsapp.net']) : [];
            allCommands().forEach(async (command) => {
             if (command.event) await command.event(sock, msg, msg.text);
             try {
              if ((MODE === 'private' && (msg.fromMe || admins.includes(msg.sender))) ||
                (MODE === 'public' && (!command.private || (msg.fromMe || admins.includes(msg.sender))))) {
                 let text = msg.text?.replace(PREFIX + command.command, '').trim();
                 if (msg.text.startsWith(PREFIX + command.command)) {
                  await command.func(sock, msg, text);
                 }
               }
             } catch (e) {
               console.log(e);
               await sock.sendMessage(sock.user.id, {
                 text: '*ERROR OCCURRED*\n\n_An error occurred while using ' + msg.command + ' command._\n_Please open an issue at https://github.com/TOXIC-DEVIL/Leon/issues for an instant support._\n\n*Error:*\n*' + e.message + '*'
               });
             }
           });
        });
 
        sock.ev.on('presence.update', () => {});
        sock.ev.on('contacts.upsert', async (contact) => store.bind(contact));
        sock.ev.on('creds.update', saveCreds);
    } catch (e) {
        console.log(e.stack);
        Connect();
    }
}

function allCommands(command) {
 let commands = [];
 fs.readdirSync('./commands').forEach(file => {
  if (file.endsWith('.js')) {
   let command = require('./commands/' + file);
   if (command.event) {
     commands.push({ command: command.command, info: command.info, private: command.private, func: command.func, event: command.event });
   } else {
     commands.push({ command: command.command, info: command.info, private: command.private, func: command.func });
   }
  }
 });
 if (command) {
  return commands.includes(command);
 } else {
  return commands;
 }
}

Connect();

module.exports = {
 Users,
 Connect,
 allCommands
};
