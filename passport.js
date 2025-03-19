const db = require('./db/queries');
const LocalStrategy = require('passport-local').Strategy;
const passwordUtil = require('./utils/password');
const passport = require('passport');

const customFields = {
  usernameField: 'email',
};

passport.serializeUser((user, done) => {
  console.log('serial');
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    console.log('deserial');
    const rows = await db.getUserByID(id);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport => {
  passport.use(
    new LocalStrategy(customFields, async (email, password, done) => {
      console.log('inside local strategy');
      try {
        const rows = await db.getUserByEmail(email);
        const user = rows[0];
        console.log('starting authenication');

        if (!user) {
          console.log('no user with that name');
          return done(null, false, { message: 'Incorrect username' });
        }
        const passwordMatch = await passwordUtil.comparePassword(
          email,
          password,
        );
        console.log(passwordMatch);
        if (!passwordMatch.success) {
          console.log('wrong passpord provided');
          console.log(user);
          console.log(password);
          return done(null, false, { message: 'Incorrect password' });
        }
        console.log('password match email');
        return done(null, user);
      } catch (error) {
        console.log('inside catch error');
        return done(error);
      }
    }),
  );
};
