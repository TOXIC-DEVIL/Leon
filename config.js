module.exports = {
  SESSION: process.env['SESSION'] || false,
  ADMINS: process.env['ADMINS'] || false,
  DATABASE_URL: process.env['DATABASE_URL'] || 'leon.db',
  DEBUG: process.env['DEBUG'] || false,
  MODE: process.env['MODE'] || 'private',
  PREFIX: process.env['PREFIX'] || '!',
  ONLINE: process.env['ONLINE'] || true,
  PLATFORM: process.env['PLATFORM'] || 'heroku',
  RBG_APIKEY: process.env['RBG_APIKEY'] || false,
};
