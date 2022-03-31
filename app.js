const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');


const campsites = require('./routes/campsites');
const reviews = require('./routes/reviews');


mongoose.connect('mongodb://localhost:27017/camp-here', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
  secret: '123456',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }

}

app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
  // res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.use('/campsites', campsites)
app.use('/campsites/:id/reviews', reviews)

app.get('/', (req, res) => {
  res.render('home')
});

app.all ('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something Went Wrong!'
  res.status(statusCode).render('error', { err })
});

app.listen(3000, () => {
  console.log("APP IS LITENING ON PORT 3000!")
});
