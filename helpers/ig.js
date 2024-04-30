const axios = require('axios');

async function instagram(url) {
  try {
    let response = await axios.get(`https://api.sssgram.com/st-tik/ins/dl?url=${url}&timestamp=${Date.now()}`, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'pt-BR,pt;q=0.8,en-US;q=0.5,en;q=0.3',
        'Accept-Encoding': 'gzip, deflate, br',
        'Origin': 'https://www.sssgram.com',
        'Connection': 'keep-alive',
        'Referer': 'https://www.sssgram.com/',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site'
      }
    })
    return response.data?.result.insBos.map((media) => media.url) || false;
  } catch (e) {
    return false;
  }
};

module.exports = { instagram };
