const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const engine = require('ejs-mate')
const Campsite = require('./models/campsite');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/camp-here', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))


app.get('/', (req, res) => {
  res.render('home')
})


app.get('/campsites', async (req, res) => {
  const campsites = await Campsite.find({});
  res.render('campsites/index', { campsites })
});


app.get('/campsites/new', (req, res) => {
  res.render('campsites/new');
});

app.post('/campsites', async (req, res) => {
  const campsite = new Campsite(req.body.campsite);
  await campsite.save();
  res.redirect(`/campsites/${campsite._id}`)
})

app.get('/campsites/:id', async (req, res,) => {
  const campsite = await Campsite.findById(req.params.id)
  res.render('campsites/show', { campsite });
});

app.get('/campsites/:id/edit', async (req, res) => {
  const campsite = await Campsite.findById(req.params.id)
  res.render('campsites/edit', { campsite })
});

app.put('/campsites/:id', async (req, res) => {
  const { id } = req.params;
  const campsite = await Campsite.findByIdAndUpdate(id, { ...req.body.campsite });
  res.redirect(`/campsites/${campsite._id}`)
})

app.delete('/campsites/:id', async (req, res) => {
  const { id } = req.params;
  await Campsite.findByIdAndDelete(id);
  res.redirect('/campsites');
})

app.listen(3000, () => {
  console.log("APP IS LITENING ON PORT 3000!")
})
