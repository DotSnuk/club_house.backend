const { Pool } = require('pg');

console.log(process.env.DB_USERNAME);

module.exports = new Pool({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'club_house',
  port: 5432,
});
