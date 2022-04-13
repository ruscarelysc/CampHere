const express = require('express');
const req = require('express/lib/request');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');
router.get('/register', (req, res) => {
  res.render('users/register')
})
router.post('/register', catchAsync (async(req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success','Welcome to CampHere!')
      res.redirect('/campsites');
    })
  } catch (e){
    req.flash('error', e.message)
    res.redirect('/register')
  }
}));

router.get('/login', (req, res) => {
  res.render('users/login')
})

router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
  req.flash('success', 'welcome back!');
  const redirectUrl = req.session.returnTo || '/campsites';
  delete req.session.returnTo;
  res.redirect(redirectUrl)
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Goodbye!');
  res.redirect('/campsites');
})

module.exports = router;
