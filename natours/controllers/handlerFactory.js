const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

// Generalized delete method that can be used in any documnet: Factory
exports.deleteDocument = (Model) =>
  catchAsync(async (req, res, next) => {
    const documnet = await Model.findByIdAndDelete(req.params.id);

    if (!documnet)
      return next(
        new AppError(`No document found with id: ${req.params.id}`, 404)
      );

    res.status(204).json({
      status: 'SUCCESS',
      data: {
        documnet: null,
      },
    });
  });
