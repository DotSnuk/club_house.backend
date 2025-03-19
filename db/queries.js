const pool = require('./pool');

async function getAllPosts() {
  const { rows } = await pool.query(`SELECT * FROM posts`);
  return rows;
}

async function doesEmailExist(email) {
  const { rows } = await pool.query(
    `SELECT email FROM users WHERE email = $1`,
    [email],
  );
  return rows.length !== 0;
}

async function createUser(data) {
  await pool.query(
    `INSERT INTO users (firstname, lastname, email, passwordhash, salt) VALUES ($1, $2, $3, $4, $5)`,
    [data.firstname, data.lastname, data.email, data.passwordhash, data.salt],
  );
}

async function getPasswordAndSalt(email) {
  const { rows } = await pool.query(
    `SELECT passwordhash, salt FROM users WHERE email = $1`,
    [email],
  );
  return rows;
}

async function getUserByEmail(email) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);
  return rows;
}

async function getUserByID(id) {
  const { rows } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return rows;
}

async function getForums() {
  const { rows } = await pool.query(`SELECT * FROM forum`);
  return rows;
}

async function getForumWithId(id) {
  const { rows } = await pool.query(`SELECT * FROM forum WHERE id = $1`, [id]);
  return rows;
}

async function getPosts(id) {
  const { rows } = await pool.query(
    `SELECT p.*, u.firstname AS user_firstname FROM posts p JOIN users u ON p.user_id = u.id WHERE forum_id = $1`,
    [id],
  );
  return rows;
}

async function postPost(data) {
  const { title, text, userId, forumId } = data;
  await pool.query(
    `INSERT INTO posts (user_id, forum_id, title, content, date_time) VALUES ($1, $2, $3, $4, NOW())`,
    [userId, forumId, title, text],
  );
}

async function updateAdmin(data) {
  const { user_id, admin } = data;
  const { rows } = await pool.query(
    `UPDATE users SET is_admin = $2 WHERE id = $1`,
    [user_id, admin],
  );
  return rows;
}

module.exports = {
  getAllPosts,
  doesEmailExist,
  createUser,
  getPasswordAndSalt,
  getUserByEmail,
  getUserByID,
  getForums,
  getForumWithId,
  getPosts,
  postPost,
  updateAdmin,
};
