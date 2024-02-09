'use strict';
const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, makeInMemoryStore, getContentType, jidNormalizedUser, generateForwardMessageContent, downloadContentFromMessage, jidDecode } = require('@whiskeysockets/baileys');
const { Sequelize, DataTypes } = require('sequelize');
const { list, uninstall } = require('./helpers/database/commands');
const { getFilter } = require('./helpers/database/filter');
const { parseJson } = require('./helpers/utils');
const { database } = require('./helpers/database.js');
const Greetings = require('./helpers/database/greetings');
const axios = require('axios');
const pino = require('pino');
const colors = require('colors');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
require('http')
 .createServer(async (req, res) => {})
 .listen(process.env?.PORT || 8080, () => true);

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

        if (process.env.AUTH_ID !== '' && !fs.existsSync('./session/creds.json')) {
         try {
          let response = await axios.post('https://leonwabot.vercel.app/auth', {
           code: process.env.AUTH_ID
          })
          let auth = Buffer.from(response.data.auth, 'base64').toString();
          fs.writeFileSync(__dirname + '/session/creds.json', auth);
          console.log('[ - ] Creating session file...');
         } catch (e) {
          console.error(e)
          return console.error('[ ! ] Please provide an AUTH_ID');
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
            msg = await require('./message')(msg, sock, store);
            if (msg.chat === 'status@broadcast') return;

            try {
             let user = await Users.findAll({ where: { id: msg.isPrivate ? msg.chat : msg.sender } });
             if (user.length < 1) {
              await Users.create({ name: msg.pushName, id: msg.isPrivate ? msg.chat : msg.sender });
             } else {
              await Users[0]?.update({ name: msg.pushName });
             }
            } catch {}

            let filters = await getFilter(msg.chat);
            filters.forEach(async (filter) => {
              let regex = new RegExp(filter.match, 'i');
              if (regex.test(msg.text) &&
                  filter.chat == msg.chat &&
                  !msg.fromBot) await msg.reply({ text: filter.response });
            });
    
            if (msg.text.startsWith('>') && msg.key.fromMe) {
                var evaluate = false;
                try {
                    evaluate = await eval(msg.text.replace('> ', '').toString());
                    try { evaluate = JSON.stringify(evaluate, null, 2); } catch {}
                } catch (e) {
                    evaluate = e.stack.toString();
                }
                await msg.reply({ text: evaluate });
            }

            let admins = (process.env?.ADMINS?.includes(',') ? process.env?.ADMINS?.split(',').map(admin => admin.trim() + '@s.whatsapp.net') : [process.env?.ADMINS?.trim() + '@s.whatsapp.net']) || [];
            allCommands().forEach(async (command) => {
             try {
              if ((process.env.MODE === 'private' && (msg.fromMe || admins.includes(msg.sender))) ||
                (process.env.MODE === 'public' && (!command.private || (msg.fromMe || admins.includes(msg.sender))))) {
                 let prefix = process.env?.PREFIX || '/';
                 let text = (msg.text.match(
                  new RegExp(`^${prefix}${command.command}\\s*(.*)`)
                 )?.[1]?.trim());
                 if (msg.text.startsWith(prefix + command.command)) {
                  await command.func(sock, msg, text);
                 }
               }
             } catch (e) {
               console.log(e);
               await sock.sendMessage(sock.user.id, {
                 text: '*ERROR OCCURRED*\n\n_An error occurred while using ' + (msg.text.includes(' ') ? msg.text.split(' ')[0] : msg.text).replace(msg.text.charAt(0), '') + ' command._\n_Please open an issue at https://github.com/TOXIC-DEVIL/Leon/issues for an instant support._\n\n*Error:*\n*' + e.message + '*'
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

function allCommands() {
 let commands = [];
 fs.readdirSync('./commands').forEach(file => {
  if (file.endsWith('.js')) {
   let command = require('./commands/' + file);
   commands.push({ command: command.command, info: command.info, private: command.private, func: command.func });
  }
 });
 return commands;
}

Connect();

module.exports = {
 Users,
 Connect,
 allCommands
};
