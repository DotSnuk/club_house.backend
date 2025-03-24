const express = require('express');
const app = express();
const router = require('./router/router');
const cors = require('cors');
const corsOptions = {
  origin: ['http://localhost:5173'],
};
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production' });
} else {
  require('dotenv').config({ path: '.env.development' });
}
const session = require('express-session');
const passport = require('passport');

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({ secret: 'cats', resave: false, saveUninitialized: false }));
app.use(passport.session());
require('./passport')(passport);

app.use('/', router);

const PORT = 10000;
app.listen(PORT, () => console.log(`app listening in on port ${PORT}`));
