const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const APIBuilder = require('./../utils/apiBuilder');

// Generalized delete method that can be used in any documnet: Factory
exports.deleteDocument = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndDelete(req.params.id);

    if (!data)
      return next(
        new AppError(`No document found with id: ${req.params.id}`, 404)
      );

    res.status(204).json({
      status: 'SUCCESS',
      data: {
        data: null,
      },
    });
  });

// Generalized update method that can be used in any documnet: Factory
exports.updateDocument = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!data)
      return next(
        new AppError(`No documnet found with id: ${req.params.id}`, 404)
      );

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        data,
      },
    });
  });

// Generalized create method that can be used in any documnet: Factory
exports.createDocument = (Model) =>
  catchAsync(async (req, res, next) => {
    const data = await Model.create(req.body);

    res.status(201).json({
      status: 'SUCCESS',
      data: {
        data,
      },
    });
  });

// Generalized read method that can be used in any documnet: Factory
exports.readDocumnet = (Model, populateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) query = query.populate(populateOptions);

    const data = await query;

    if (!data)
      return next(new AppError(`No tour found with id: ${req.params.id}`, 404));

    res.status(200).json({
      status: 'SUCCESS',
      data: {
        data,
      },
    });
  });

// Generalized read all method that can be used in any documnet: Factory
exports.readAllDocumnets = (Model) =>
  catchAsync(async (req, res, next) => {
    // to support nested router in GET all reviews
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const builder = new APIBuilder(Model.find(filter), req.query)
      .filtering()
      .sorting()
      .limiting()
      .paginating();
    const data = await builder.query;

    res.status(200).json({
      status: 'SUCCESS',
      requestTime: req.requestTime,
      resutls: data.length,
      data: {
        data,
      },
    });
  });
