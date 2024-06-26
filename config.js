module.exports = {
  SESSION: process.env['SESSION'] || false,
  ADMINS: process.env['ADMINS'] || false,
  DATABASE_URL: process.env['DATABASE_URL'] || 'leon.db',
  HEROKU_APP_NAME: process.env['HEROKU_APP_NAME'] || false,
  HEROKU_API_TOKEN: process.env['HEROKU_API_TOKEN'] || false,
  MODE: process.env['MODE'] || 'private',
  PREFIX: process.env['PREFIX'] || '!',
  PLATFORM: process.env['PLATFORM'] || 'heroku',
  RBG_APIKEY: process.env['RBG_APIKEY'] || false,
};
