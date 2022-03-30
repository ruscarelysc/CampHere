const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const { campsiteSchema, reviewSchema } = require('./schemas.js')
const catchAsync = require('./utilities/catchAsync');
const ExpressError = require('./utilities/ExpressError');
const methodOverride = require('method-override');
const Campsite = require('./models/campsite');
const Review = require('./models/review');
const { findByIdAndUpdate } = require('./models/review');

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

const validateCampsite = (req, res, next) => {
  const { error } = campsiteSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(e => e.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(e => e.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/campsites', catchAsync(async (req, res) => {
  const campsites = await Campsite.find({});
  res.render('campsites/index', { campsites })
}));

app.get('/campsites/new', (req, res) => {
  res.render('campsites/new');
});


app.post('/campsites', validateCampsite, catchAsync(async (req, res) => {
  // if (!req.body.campsite) throw new ExpressError('Invalid Campsite Data', 400);
  const campsite = new Campsite(req.body.campsite);
  await campsite.save();
  res.redirect(`/campsites/${campsite._id}`)
}))

app.get('/campsites/:id', catchAsync(async (req, res,) => {
  const campsite = await Campsite.findById(req.params.id).populate('reviews')
  res.render('campsites/show', { campsite });
}));

app.get('/campsites/:id/edit', catchAsync(async (req, res) => {
  const campsite = await Campsite.findById(req.params.id)
  res.render('campsites/edit', { campsite })
}));

app.put('/campsites/:id', validateCampsite, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campsite = await Campsite.findByIdAndUpdate(id, { ...req.body.campsite });
  res.redirect(`/campsites/${campsite._id}`)
}));

app.delete('/campsites/:id', catchAsync( async (req, res) => {
  const { id } = req.params;
  await Campsite.findByIdAndDelete(id);
  res.redirect('/campsites');
}));

app.post('/campsites/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const campsite = await Campsite.findById(req.params.id);
  const review = new Review(req.body.review);
  campsite.reviews.push(review);
  await review.save();
  await campsite.save();
  res.redirect(`/campsites/${campsite._id}`);
}));

app.delete('/campsites/:id/reviews/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campsite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.redirect(`/campsites/${id}`);
}));

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
