const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

// const User = require('./userModel');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is mandetory in tour'],
      unique: true,
      minlength: [8, 'Name must have atleast 8 characters'],
      maxlength: [40, 'Name can only have 40 characters'],
      // validate: [
      //   validator.isAlphanumeric, // third party validator
      //   'The name can only contain letters and numbers',
      // ],
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Only difficulties available are easy, medium and difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: [1, 'The lowest rating is 1'],
      max: [5, 'The highest rating is 5'],
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
      validate: {
        validator: function (val) {
          // 'this' object contain the current document only when creating new documents and incomming (val) is the field value
          return this.price > val;
        },
        message: 'The discount should be lower than the price',
      },
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
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    secret: {
      type: Boolean,
      default: false,
    },
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // this is the referance to User collection in DB
      },
    ],
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

// Embedding: this documnet middleware will take all the ids in the guides feild and replace them with the details of the guides
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

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

// query middleware to populate the guides feild in all tour queries
tourSchema.pre(/^find/, function (next) {
  // populate() will take the IDs from the field with refference and automatically fill it with data
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

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

// mongoose aggregation middleware that runs before aggregation execute
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } }); // adding a new aggregation at the begining of the aggregation pipeline
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
