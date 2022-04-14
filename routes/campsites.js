const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const Campsite = require('../models/campsite');
const { isLoggedIn, isAuthor, validateCampsite } = require('../middleware');
const campsites = require('../controllers/campsites')


router.route('/')
  .get(catchAsync(campsites.index))
  .post(isLoggedIn, validateCampsite, catchAsync(campsites.createCampsite))

router.get('/new', isLoggedIn, campsites.newForm);

router.route('/:id')
  .get( catchAsync(campsites.showCampsite))
  .put(isLoggedIn, isAuthor, validateCampsite, catchAsync(campsites.updateCampsite))
  .delete(isLoggedIn, isAuthor, catchAsync(campsites.deleteCampsite));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(campsites.editForm));


module.exports = router;
