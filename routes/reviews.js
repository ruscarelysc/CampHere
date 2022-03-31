const express = require('express');
const router = express.Router({ mergeParams: true });

const Campsite = require('../models/campsite');
const Review = require('../models/review');

const { reviewSchema } = require('../schemas.js')

const ExpressError = require('../utilities/ExpressError');
const catchAsync = require('../utilities/catchAsync');

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(e => e.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

router.post('/', catchAsync(async (req, res) => {
  const campsite = await Campsite.findById(req.params.id);
  const review = new Review(req.body.review);
  campsite.reviews.push(review);
  await review.save();
  await campsite.save();
  req.flash('success', 'Created new review!')
  res.redirect(`/campsites/${campsite._id}`);
}));

router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;
  await Campsite.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Review deleted!')
  res.redirect(`/campsites/${id}`);
}));

module.exports = router;
