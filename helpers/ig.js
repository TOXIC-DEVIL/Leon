const CryptoJS = require('crypto-js');

async function instagram(url) {
  try {
    let headers = { 'url': encryptUrl(url) };
    const response = await fetch('https://backend.instavideosave.com/allinone', {
      method: 'GET',
      headers,
    });
    let data = await response.json();
    if (!data) return false;
    let result = [];
    if (data.image) {
      data.image.map(image => {
        result.push(image);
      });
    } 
    else if (data.video) {
      data.video.forEach(v => {
        if (v.video) result.push(v.video);
      });
    }
    else {
      result = false;
    }
    return { data: result };
  } catch (e) {
    console.log(e);
    return false;
  }
};

function encryptUrl(input) {
  const key = CryptoJS.enc.Utf8.parse('qwertyuioplkjhgf');
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(input, key, {
    iv: iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  const encryptedHex = encrypted.ciphertext.toString(CryptoJS.enc.Hex);
  return encryptedHex;
};

module.exports = { instagram };
