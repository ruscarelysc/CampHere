const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const { campsiteSchema } = require('../schemas.js')
const ExpressError = require('../utilities/ExpressError');
const Campsite = require('../models/campsite');

const validateCampsite = (req, res, next) => {
  const { error } = campsiteSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(e => e.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next();
  }
}

router.get('/', catchAsync(async (req, res) => {
  const campsites = await Campsite.find({});
  res.render('campsites/index', { campsites })
}));

router.get('/new', (req, res) => {
  res.render('campsites/new');
});

router.post('/', validateCampsite, catchAsync(async (req, res) => {
  // if (!req.body.campsite) throw new ExpressError('Invalid Campsite Data', 400);
  const campsite = new Campsite(req.body.campsite);
  await campsite.save();
  req.flash('success', 'New campsite created succesfully!')
  res.redirect(`/campsites/${campsite._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
  const campsite = await Campsite.findById(req.params.id).populate('reviews')
  if (!campsite) {
    req.flash ('error','Cannot find that Campsite');
    res.redirect('/campsites')
  }
  res.render('campsites/show', { campsite });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
  const campsite = await Campsite.findById(req.params.id)
  res.render('campsites/edit', { campsite })
}));

router.put('/:id', validateCampsite, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campsite = await Campsite.findByIdAndUpdate(id, { ...req.body.campsite });
  req.flash('success', 'Updated succesfully!')
  res.redirect(`/campsites/${campsite._id}`)
}));

router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campsite.findByIdAndDelete(id);
  req.flash('success', 'Campsite deleted!')
  res.redirect('/campsites');
}));


module.exports = router;
