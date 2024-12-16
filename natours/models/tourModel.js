const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is mandetory in tour'],
      unique: true,
    },
    slug: String,
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
    secret: {
      type: Boolean,
      default: false,
    },
  },
  {
    // each time the schema is converted to JSON and object we need virtuals as well
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// virtual property is a derived property from the actual data
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// mongoose document middleware that runs before .save() and create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// mongoose document middleware that runs after .save() and create()
// tourSchema.post('save', function (doc, next) {
//   console.log('This is after saving ', doc);
//   next();
// });

// mongoose query middleware that runs before find()
// tourSchema.pre('find', function (next) {
// regex to run this middleware in all queries that starts with find
tourSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  this.find({ secret: { $ne: true } });
  next();
});

// mongoose query middleware that runs after queies satarting with find
tourSchema.post(/^find/, function (docs, next) {
  console.log(
    `Execution time of query is ${Date.now() - this.start} milliseconds`
  );
  // console.log(docs);
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
