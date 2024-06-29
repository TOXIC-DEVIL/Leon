const axios = require('axios');

async function parseJson(opt) {
  let options = {
    method: 'GET',
    url: '',
    timeout: 5000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
  };
  if (typeof opt !== 'object') opt = { url: opt };
  options = {
    ...options,
    ...opt,
    headers: {
      ...options.headers,
      ...opt.headers
    }
  };
  try {
   let { data } = await axios.request(options);
   return data;
  } catch (e) {
   throw e;
  }
}

function isUrl(url) {
  return (/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}/).test(url);
}

function numericalToString(number) {
  if (isNaN(number)) return false;
  if (number >= 1000000) return (number / 1000000).toFixed(1) + 'M';
  else if (number >= 1000) return (number / 1000).toFixed(1) + 'K';
  else return number.toString();
}

function convertTimestamp(timestamp) {
  const d = new Date(timestamp * 1000);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return {
    date: d.getDate(),
    month: new Intl.DateTimeFormat('en-US', { month: 'long' }).format(d),
    year: d.getFullYear(),
    day: daysOfWeek[d.getUTCDay()],
    time: `${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`
  }
}


module.exports = { parseJson, convertTimestamp, isUrl, numericalToString };
