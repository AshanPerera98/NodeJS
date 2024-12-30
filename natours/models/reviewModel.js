const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [1, 'The lowest rating is 1'],
      max: [5, 'The highest rating is 5'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must have a reference tour'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must have a reference user'],
    },
  },
  {
    // each time the schema is converted to JSON and object we need virtuals (fields that are not in the DB but calculated using other values) as well
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// query middleware to populate the tour and useer
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name',
  }).populate({
    path: 'user',
    select: 'name photo',
  });

  next();
});

// static method, static methods can be executed in Models so that aggregate pipeline can be utilized
reviewSchema.statics.calculateAverageRating = async function (tourId) {
  // "this" keyword points to the model
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        numberOfRatings: { $sum: 1 },
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  // "stats" returns an array with one object containing the results
  const { ratingsAverage, ratingsQuantity } = stats[0];

  //   Update the relevant tour with calculated stats
  if (stats.length > 0)
    await Tour.findByIdAndUpdate(tourId, { ratingsAverage, ratingsQuantity });
  //   defaults
  else
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4.5,
      ratingsQuantity: 0,
    });
};

// document middleware to execute static method after saving
reviewSchema.post('save', function () {
  // "this.constructor" will point to the model that the document is created
  // "this" points to the current doc
  this.constructor.calculateAverageRating(this.tour);
});

// findOneAndUpdate
// findOneAndDelete
// cannot use documnet middleware in update and delete so have to use pre query middleware
reviewSchema.pre(/^findOneAnd/, async function (next) {
  // query middleware doesnt have access to the document so query ("this") needs to be executed to get the document
  // cannot do the calculation at this poit because current query ("this") returns the document before doing the change beacuse this is a PRE middleware
  // Adding the result documnet to the query to be used in post middleware
  this.alteringReview = this.findOne();
  next();
});

// post query middlware to add the stats to the tour
reviewSchema.post(/^findOneAnd/, async function () {
  // "this.alteringReview.constructor" will point to the Model which is used to create the documnet
  await this.alteringReview.constructor.calculateAverageRating(
    this.alteringReview.tour
  );
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
