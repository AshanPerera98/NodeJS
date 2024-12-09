const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is mandetory in tour'],
    unique: true,
  },
  duration: {
    type: Number,
    reuired: [true, 'Duration is required'],
  },
  maxGroupSize: {
    type: Number,
    reuired: [true, 'Group size is required'],
  },
  difficulty: {
    type: String,
    reuired: [true, 'Difficulty is required'],
  },
  ratingsAverage: {
    type: Number,
    default: 0,
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'Price is mandetory in tour'],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'Summary is required'],
  },
  description: {
    type: String,
    trim: true,
  },
  imageCover: {
    type: String,
    required: [true, 'Cover image is required'],
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false, // this will make this field not visible to client
  },
  startingDates: [Date],
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
