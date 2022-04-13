const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const CampSiteSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

CampSiteSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await review.deleteMany({
      _id: {
        $in: doc.review
      }
    })
  }
})

module.exports = mongoose.model('Campsite', CampSiteSchema);
