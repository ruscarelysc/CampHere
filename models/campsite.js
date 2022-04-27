const mongoose = require('mongoose');
const review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
  return this.url.replace('/upload', '/upload/w_200');
});

const opts = { toJSON: { virtuals: true } };

const CampSiteSchema = new Schema({
  title: String,
  images: [ImageSchema],
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
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
}, opts);

CampSiteSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/campsites/${this._id}">${this.title}</a><strong>
    <p>${this.description.substring(0, 20)}...</p>`
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
