const { body } = require('express-validator');
const db = require('../db/queries');
const PASSWORD_MIN_LENGTH = 3;
const PASSWORD_MIN_NUMBER = 1;

const notEmptyError = `can't be empty`;
const alphaError = 'must only contain letters';
const emailError = 'must be valid email adress';
const emailExistsError = 'email already exists';
const passwordError = `must be at least ${PASSWORD_MIN_LENGTH} long and have at least ${PASSWORD_MIN_NUMBER} number`;
const passwordMatchError = 'must match password';

const validateName = [
  body('firstname')
    .trim()
    .notEmpty()
    .withMessage(notEmptyError)
    .isAlpha()
    .withMessage(alphaError),
  body('lastname')
    .trim()
    .notEmpty()
    .withMessage(notEmptyError)
    .isAlpha()
    .withMessage(alphaError),
];

const validateEmail = body('email')
  .trim()
  .notEmpty()
  .withMessage(notEmptyError)
  .isEmail()
  .withMessage(emailError)
  .custom(async value => {
    if (await db.doesEmailExist(value)) {
      throw new Error('email exists');
    } else {
      console.log('email doesnt exist');
      return value;
    }
  })
  .withMessage(emailExistsError);

const validatePassword = body('password')
  .isStrongPassword({
    minLength: PASSWORD_MIN_LENGTH,
    minLowercase: 0,
    minUppercase: 0,
    minNumbers: PASSWORD_MIN_NUMBER,
    minSymbols: 0,
  })
  .withMessage(passwordError);

const validateConfirmPassword = body('confirmPassword')
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error(`Password don't match`);
    } else {
      return value;
    }
  })
  .withMessage(passwordMatchError);

module.exports = {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
};
