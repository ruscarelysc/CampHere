const mongoose = require('mongoose');
const { places, descriptors } = require('./seedHelpers');
const Campsite = require('../models/campsite');
const { City } = require('country-state-city');

mongoose.connect('mongodb://localhost:27017/camp-here', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campsite.deleteMany({});
  cities = City.getCitiesOfState('AU', 'VIC');
  for (let i = 0; i < 50; i++) {
    city = cities[i];
    const random100 = Math.floor(Math.random() * 100);
    const camp = new Campsite({
      location: `${city.name}, ${city.stateCode}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    })
    await camp.save();
  }
}


seedDB().then(() => {
  mongoose.connection.close();
})
