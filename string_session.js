const { default: makeWASocket, useMultiFileAuthState, makeInMemoryStore, fetchLatestBaileysVersion, delay } = require('@whiskeysockets/baileys');
const readline = require('readline-sync');
const pino = require('pino');
const colors = require('colors');
const fs = require('fs');

colors.setTheme({
  question: ['brightCyan', 'bold'],
  option: ['brightYellow', 'italic'],
  loading: ['brightWhite', 'italic'],
  error: ['brightRed', 'bold'],
  success: ['brightGreen', 'bold']
});

let store = makeInMemoryStore({
  logger: pino().child({ level: 'silent', stream: 'store' })
});

const centerText = text => {
  const width = process.stdout.columns;
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(padding) + text;
};

let heading = `
${centerText('======================================')}
${centerText('Leon Installation')}
${centerText('======================================')}
`;

let infoBox = `
${centerText('┌─────────────────────────────────────────────┐')}
${centerText('│ Version: 2.0.0                              │')}
${centerText('│ Channel: https://t.me/leonwabot             │')}
${centerText('└─────────────────────────────────────────────┘')}
`;

let QRinstructionBox = `
${colors.option(centerText('! ATTENTION !'))}
${colors.option('1. QR Code will be regenerated every 30 seconds.')}
${colors.option('2. Scan the QR code with your WhatsApp > 3 dots > Linked Devices > Link a Device > Scan the QR > Code generated.')}
`;

let PCinstructionBox = `
${colors.option(centerText('! ATTENTION !'))}
${colors.option('1. Pairing code will be generated once.')}
${colors.option('2. Type the pairing code in WhatsApp > 3 dots > Linked Devices > Link a Device > Link with phone number after it is generated.')}
`;

process.stdout.write('\x1B[2J\x1B[0f');
console.log(heading);

while (true) {
  console.log(colors.option('[0] Cancel'));
  console.log(colors.option('[1] Scan QR Code (2 devices required)'));
  console.log(colors.option('[2] Pair with WhatsApp number\n'));
  let methodIndex = readline.question(colors.question('Choose a method for string session generation: '));
  if (methodIndex == '0') {
    console.log(colors.error('Leon installation process terminated!'));
    process.exit(0);
  }
  else if (methodIndex == '1' || methodIndex == '2') {
    process.stdout.write('\x1B[2J\x1B[0f');
    console.log(heading);
    console.log(methodIndex === '1' ? QRinstructionBox : PCinstructionBox);
    Leon(methodIndex === '1');
    break;
  }
  else {
    console.log(colors.error('Choose a valid method, please enter 1, 2 or 0.\n'));
   }
}

try {
  fs.rmSync('./session/', { recursive: true, force: true });
} catch {}

async function Leon(qr) {
  // let { version } = await fetchLatestBaileysVersion();
  let { state, saveCreds } = await useMultiFileAuthState('./session/');
  let sock = makeWASocket({
    logger: pino({ level: 'silent' }),
    printQRInTerminal: qr,
    markOnlineOnConnect: false,
    browser: ['Ubuntu', 'Chrome', '20.0.04'],
    auth: state,
    version: [2, 3000, 1015901307],
    getMessage: async (key) => {
      let jid = jidNormalizedUser(key.remoteJid);
      let msg = await store.loadMessage(jid, key.id);
      return msg?.message || "";
    },
  });
  store.bind(sock.ev);

  if (!qr && !sock.authState.creds.registered) {
    let number = readline.question(colors.question('Enter your WhatsApp number with country code (eg: +91xxx): '));
    try {
      await delay(3000);
      var code = await sock.requestPairingCode(number.replace(/\D/g, ''));
    } catch (e) {
      console.log(e.stack);
      console.log(colors.error('Please enter a valid whatsapp number with country code!'));
      process.exit(0);
    }
    console.log(colors.question('Your WhatsApp Pairing Code is:'));
    console.log(colors.success(code));
  }

  sock.ev.on('connection.update', async (update) => {
    let { connection } = update;
    if (connection === 'open') {
      await delay(3000);
      let creds = fs.readFileSync('./session/creds.json', 'utf8');
      let session = Buffer.from(creds, 'utf8').toString('base64');
      await sock.sendMessage(sock.user.id, {
        text: session
      });
      console.log(colors.question('\nYour session is:'));
      console.log(session);
      console.log(colors.success(`\nSession saved! (${__dirname + '/session/creds.json'})`));
      process.exit(1);
    } else if (connection === 'close') {
      await Leon(qr);
    }
  });

  sock.ev.on('messages.upsert', async () => {});
  sock.ev.on('creds.update', saveCreds);
}
