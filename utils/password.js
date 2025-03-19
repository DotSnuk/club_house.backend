const bcrypt = require('bcryptjs');
const db = require('../db/queries');

async function genHash(password, salt) {
  return await bcrypt.hash(password, salt);
}

async function genPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const passwordhash = await genHash(password, salt);
  return { passwordhash, salt };
}

async function comparePassword(email, providedPassword) {
  const passwordAndSalt = await db.getPasswordAndSalt(email);
  if (passwordAndSalt.length === 0)
    return { success: false, msg: `email doesn't exist` };
  const { passwordhash } = passwordAndSalt[0];
  if (await bcrypt.compare(providedPassword, passwordhash))
    return { success: true, msg: `it matches` };
  return { success: false, msg: `password don't match` };

  // if passwordAndSalt is length = 0 then the email doesn't exist
  //
  // get salt and hashedPassword stored in db
  // compare the hashedPassword with the return value from
  // genHash with providedPassword and the salt from the db
}

module.exports = {
  genPassword,
  comparePassword,
};
