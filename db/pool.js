const { Pool } = require('pg');

module.exports = new Pool({
  host: 'localhost',
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: 'club_house',
  port: 5432,
});
