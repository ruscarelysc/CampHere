const Joi = require('joi');
const { modelName } = require('./models/review');

module.exports.campsiteSchema =  Joi.object({
  campsite: Joi.object({
    title: Joi.string().required(),
    image: Joi.string().required(),
    price: Joi.number().required().min(0),
    description: Joi.string().required(),
    location: Joi.string().required()
  }).required()
});

module.exportsreviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    review: Joi.string().required()
  }).required
})
