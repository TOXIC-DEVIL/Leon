const axios = require('axios');
const cheerio = require('cheerio');

async function instagram(url) {
  try {
    let response = await axios.post(
      'https://v3.saveig.app/api/ajaxSearch', `q=${encodeURIComponent(url)}&t=media&lang=en`, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
          "X-Requested-With": "XMLHttpRequest",
        }
      }
    );
    let $ = cheerio.load(response.data.data);
    let result = $('.download-items__btn > a').map((_, a) => $(a).attr('href')).get();

    return { data: result };
  } catch (e) {
    console.log(e);
    return false;
  }
};

module.exports = { instagram };
