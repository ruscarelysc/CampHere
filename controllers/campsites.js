const Campsite = require('../models/campsite');

module.exports.index = async (req, res) => {
  const campsites = await Campsite.find({});
  res.render('campsites/index', { campsites })
}

module.exports.newForm = (req, res) => {
  res.render('campsites/new');
}

module.exports.createCampsite = async (req, res) => {
  const campsite = new Campsite(req.body.campsite);
  campsite.author = req.user._id;
  await campsite.save();
  req.flash('success', 'New campsite created succesfully!')
  res.redirect(`/campsites/${campsite._id}`)
}

module.exports.showCampsite = async (req, res,) => {
  const campsite = await Campsite.findById(req.params.id).populate({
    path: 'reviews',
    populate: {
      path: 'author'
    }
  }).populate('author');
  if (!campsite) {
    req.flash('error', 'Cannot find that Campsite');
    res.redirect('/campsites')
  }
  res.render('campsites/show', { campsite });
}

module.exports.editForm = async (req, res) => {
  const { id } = req.params;
  const campsite = await Campsite.findById(id)
  if (!campsite) {
    req.flash('error', 'Cannot find that Campsite');
    return res.render('/campsites')
  }
  res.render('campsites/edit', { campsite });
}

module.exports.updateCampsite = async (req, res) => {
  const { id } = req.params;
  const campsite = await Campsite.findByIdAndUpdate(id, { ...req.body.campsite });
  req.flash('success', 'Updated succesfully!')
  res.redirect(`/campsites/${campsite._id}`)
}

module.exports.deleteCampsite = async (req, res) => {
  const { id } = req.params;
  await Campsite.findByIdAndDelete(id);
  req.flash('success', 'Campsite deleted!')
  res.redirect('/campsites');
}
