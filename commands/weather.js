const { parseJson } = require('../helpers/utils');

module.exports = {
  command: 'weather',
  info: 'Fetches weather updates of provided place.',
  private: false,
  func: async (sock, msg, text) => {
    if (!text) return await msg.reply({ text: '*Please enter a city name!*\n*Example:*\n*- New York*' });
    try {
      var data = await parseJson('http://api.openweathermap.org/data/2.5/weather?q=' + text + '&units=metric&appid=060a6bcfa19809c2cd4d97a212b19273&language=en');
    } catch {
      return await msg.reply({ text : '*Invalid city, Please enter a valid city name!*' });
    }
    return await msg.reply({
      text: `_City_ : *${data.name}*\n` +
            `_Weather_ : *${data.weather[0].main}*\n` +
            `_Climate_ : *${data.weather[0].description}*\n` +
            `_Temperature_ : *${data.main.temp}°C*\n` +
            `_Pressure_ : *${data.main.pressure} hPa*\n` +
            `_Humidity Level_ : *${data.main.humidity}%*\n` +
            `_Visibility_ : *${data.visibility} meters*\n` +
            `_Wind Speed_ : *${data.wind.speed} m/s*\n` +
            `_Wind Direction_ : *${data.wind.deg}°*\n` +
            `_Cloudiness_ : *${data.clouds.all}%*`
    });
  }
};
