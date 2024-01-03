const axios = require('axios');

async function parseJson(url) {
  try {
   let { data } = await axios.get(url);
   return data;
  } catch (e) {
   console.log('An error occurred while fetching JSON:\n\n' + e.stack);
   return false;
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
