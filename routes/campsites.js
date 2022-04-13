const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campsite = require('../models/campsite');
const { isLoggedIn, isAuthor, validateCampsite } = require('../middleware');


router.get('/', catchAsync(async (req, res) => {
  const campsites = await Campsite.find({});
  res.render('campsites/index', { campsites })
}));

router.get('/new', isLoggedIn, (req, res) => {
  res.render('campsites/new');
});

router.post('/', isLoggedIn, validateCampsite, catchAsync(async (req, res) => {
  const campsite = new Campsite(req.body.campsite);
  campsite.author = req.user._id;
  await campsite.save();
  req.flash('success', 'New campsite created succesfully!')
  res.redirect(`/campsites/${campsite._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
  const campsite = await Campsite.findById(req.params.id).populate({
    path:'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if (!campsite) {
    req.flash ('error','Cannot find that Campsite');
    res.redirect('/campsites')
  }
  res.render('campsites/show', { campsite });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campsite = await Campsite.findById(id)
  if (!campsite) {
    req.flash('error', 'Cannot find that Campsite');
    return res.render('/campsites')

  }
  res.render('campsites/edit', { campsite });
}));

router.put('/:id', isLoggedIn, isAuthor, validateCampsite, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campsite = await Campsite.findByIdAndUpdate(id, { ...req.body.campsite });
  req.flash('success', 'Updated succesfully!')
  res.redirect(`/campsites/${campsite._id}`)
}));

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  await Campsite.findByIdAndDelete(id);
  req.flash('success', 'Campsite deleted!')
  res.redirect('/campsites');
}));


module.exports = router;
