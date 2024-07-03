const config = require('../config');
const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'gps',
  info: 'Locate a place in google map.',
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter a location!*\n*The location may not be accurately marked for all places.*\n*Example:*\n*- ' + config.PREFIX + 'gps Kerala, India*' });
    let failed = '*❌ Invalid location, please enter a valid location!*';
    try {
      var loc = await parseJson(`https://nominatim.openstreetmap.org/search?addressdetails=1&q=${text.replace(' ', '+')}&format=json`);
    } catch {
      return await msg.reply({ text: failed });
    }
    if (loc.length !== 0) {
      let lon = loc[0].lon;
      let lat = loc[0].lat;
      return await sock.sendMessage(msg.chat, {
        location: {
          degreesLatitude: lat,
          degreesLongitude: lon
        }
      });
    } else {
      return await msg.reply({ text: failed });
    }
  }
};
