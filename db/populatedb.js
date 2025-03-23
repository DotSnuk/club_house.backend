#! /usr/bin/env node
const path = require('path');
require('dotenv').config({
  path: path.resolve(__dirname, '../.env.production'),
});
const { Client } = require('pg');

// connect to db
// check if tables exists
// or more specifically create table if does not exist with sql

// const {Client} = require('pg');
const SQL = `
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    email text NOT NULL,
    firstname text NOT NULL,
    lastname text NOT NULL,
    passwordhash text NOT NULL,
    salt text NOT NULL,
    is_admin boolean DEFAULT false NOT NULL
);

CREATE TABLE IF NOT EXISTS forum (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id INTEGER,
    forum_id INTEGER,
    title TEXT NOT NULL,
    context TEXT NOT NULL,
    date_time timestamp without time zone NOT NULL,
    CONSTRAINT fk_user_id
      FOREIGN KEY(user_id)
        REFERENCES users(id),
    CONSTRAINT fk_forum_id
      FOREIGN KEY(forum_id)
        REFERENCES forum(id)
);

INSERT INTO forum (title) SELECT 'General'
  WHERE NOT EXISTS (SELECT * FROM forum);`;

async function main() {
  console.log('seeding');

  const client = new Client({
    connectionString: process.env.DB_DEPLOY_URL,
  });

  try {
    await client.connect();
    console.log('connected');
    await client.query(SQL);
    console.log('db created successfully');
  } catch (error) {
    console.error('error setting up', error);
  } finally {
    await client.end();
    console.log('db connection closed');
  }
  console.log('done');
}

// now getting error with one of the syntax (WHERE). progress!

main();
