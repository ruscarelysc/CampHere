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
  for (let i = 0; i < 10; i++) {
    city = cities[i];
    const price = Math.floor(Math.random() * 20 + 10);
    const camp = new Campsite({
      author: "625510159019f927efb05b17",
      location: `${city.name}, ${city.stateCode}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price,
      description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reprehenderit cupiditate optio sapiente repudiandae non mollitia consectetur minima recusandae expedita accusamus tempora, provident deserunt, illum voluptatum nulla dolorem, quia adipisci. Consequatur.',
      images: [
        {
          url: 'https://res.cloudinary.com/ruscarelysc/image/upload/v1650282206/CampHere/mbo7r8d2emqdmmmityms.webp',
          filename: 'CampHere/mbo7r8d2emqdmmmityms'
        },
        {
          url: 'https://res.cloudinary.com/ruscarelysc/image/upload/v1650282207/CampHere/lule8myamy2lb6u2xqum.jpg',
          filename: 'CampHere/lule8myamy2lb6u2xqum'

        }

      ]
    })
    await camp.save();
  }
}


seedDB().then(() => {
  mongoose.connection.close();
})
