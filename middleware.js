const { campsiteSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utilities/ExpressError');
const Campsite = require('./models/campsite')
const Review = require('./models/review')

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be signed in first');
    return res.redirect('/login');
  }
  next();
}

module.exports.validateCampsite = (req, res, next) => {
  const { error } = campsiteSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(e => e.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campsite = await Campsite.findById(id);
  if (!campsite.author.equals(req.user._id)) {
    req.flash('error', 'No permission to do that');
    return res.redirect(`/campsites/${id}`);
  }
  next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'No permission to do that');
    return res.redirect(`/campsites/${id}`);
  }
  next();
}

module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(e => e.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}
