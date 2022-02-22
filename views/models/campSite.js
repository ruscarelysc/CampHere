const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const campSiteSchema = new Schema ({
  title: String,
  price: Number,
  description: String,
  location: String
});

module.export = mongoose.model('Campsite', campSiteSchema);
