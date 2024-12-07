const mongoose = require('mongoose');

const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is mandetory in tour'],
    unique: true,
  },
  rating: { type: Number, default: 1.0 },
  price: { type: Number, required: [true, 'Price is mandetory in tour'] },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
