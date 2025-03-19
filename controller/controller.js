const { validationResult } = require('express-validator');
const db = require('../db/queries');
const validator = require('./validatior');
const passport = require('passport');
const passwordUtil = require('../utils/password');

const createUser = [
  validator.validateName,
  validator.validateEmail,
  validator.validatePassword,
  validator.validateConfirmPassword,
  (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      console.log(result.validationResult);
      return res.send({ success: false, errors: [...result.errors] });
    }
    next();
  },
  async (req, res) => {
    // add to db
    const { firstname, lastname, email, password } = req.body;
    const passhashAndSalt = await passwordUtil.genPassword(password);
    console.log(passhashAndSalt);
    const data = {
      firstname,
      lastname,
      email,
      passwordhash: passhashAndSalt.passwordhash,
      salt: passhashAndSalt.salt,
    };
    await db.createUser(data);
    res.send({ success: true });
  },
];

const loginUser = [
  passport.authenticate('local'),
  (req, res, next) => {
    res.status(200).send({ success: true, user: req.user });
  },
];

const logout = (req, res, next) => {
  req.logout(err => {
    console.log('logging out');
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
};

const authStatus = (req, res) => {
  if (req.isAuthenticated()) {
    return res.send({ isAuthenticated: true, user: req.user });
  }
  return res.send({ isAuthenticated: false });
};

const getForums = async (req, res) => {
  const data = await db.getForums();
  return res.status(200).send(data);
};

const getForumWithId = async (req, res) => {
  const { id } = req.params;
  const data = await db.getForumWithId(id);
  if (data.length === 1) {
    return res.status(200).send(data[0]);
  }
  return res.status(401).send('not found');
};

const getPosts = async (req, res) => {
  const { id } = req.params;
  const data = await db.getPosts(id);
  return res.status(200).send(data);
};

const postPost = async (req, res) => {
  const response = await db.postPost(req.body);
  return res.status(200).send({ success: true, response });
};

const postAdmin = async (req, res) => {
  const response = await db.updateAdmin(req.body);
  return res.status(200).send(response);
};

module.exports = {
  createUser,
  loginUser,
  logout,
  authStatus,
  getForums,
  getForumWithId,
  getPosts,
  postPost,
  postAdmin,
};
