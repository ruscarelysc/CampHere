const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const Campsite = require('./models/campsite');
const { City }= require('country-state-city');


mongoose.connect('mongodb://localhost:27017/camp-here', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.render('home')
})

app.get('/makecampsite', async (req, res) => {
  const camp = new Campsite({ title: 'My Backyard', description: 'cheap camping!'});
  await camp.save();
  res.send(camp)
})


app.get('/campsites', async (req, res) => {
  const campsites = await Campsite.find({});
  res.render('campsites/index', { campsites })
});


app.listen(3000, () => {
  console.log("APP IS LITENING ON PORT 3000!")
})
