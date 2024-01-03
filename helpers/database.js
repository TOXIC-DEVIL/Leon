const { Sequelize, DataTypes } = require('sequelize');

const database = new Sequelize(process.env.DATABASE_URL, {
 dialectOptions: {
  ssl: {
   require: true,
   rejectUnauthorized: false
  } 
 }, logging: false 
});

try {
 database.authenticate();
} catch {
 console.log('[ ! ] Cannot authenticate with database.');
 console.log('Make sure you have provided a valid DATABASE_URL as environment variable.');
}
try {
 database.sync();
} catch {
 console.log('[ ! ] Cannot sync database.');
}

module.exports = { database };
