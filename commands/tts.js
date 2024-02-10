const gtts = require('google-tts-api');

module.exports = {
  command: 'tts',
  info: 'Converts text to speech using Google Text-To-Speech.',
  private: false,
  func: async (sock, msg, text) => {
    let ttsText = text !== '' ? text : msg.replied && msg.replied.text ? msg.replied.text : false
    if (!ttsText) return await msg.reply({ text: '*Please enter or reply to any text to speak!*' });
    let lang = 'en', ttsMessage = ttsText, isSlow = false
    if (langMatch = ttsMessage.match('\\{([a-zA-Z]{2})\\}')) lang = langMatch[1], ttsMessage = ttsMessage.replace(langMatch[0], '')
    if (ttsMessage.includes('{slow}')) ttsMessage = ttsMessage.replace(/{slow}/g, ''), isSlow = true
    if (ttsMessage.length > 200) return await msg.reply({ text: '*Lengthy text, The text you entered is so lengthy to speak, maximum 200 characters only!*' });
    let audio = false;
    try {
     audio = await gtts.getAudioUrl(ttsMessage, { lang: lang, slow: isSlow, host: 'https://translate.google.com' });
    } catch {
     return await msg.reply({ text: '*Invalid Language, enter a valid language code!*\n\n*Don\'t know language code of your language?*\n*Checkout:* https://en.m.wikipedia.org/wiki/List_of_ISO_639-1_codes' });
    }
    return await msg.reply({ audio: { url: audio }, mimetype: 'audio/mpeg', ptt: true });
   }
  };
