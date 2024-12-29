const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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
