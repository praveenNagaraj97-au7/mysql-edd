// Checkers
import { AppError } from "../utils/appError";
import { catchAsyncError } from "../utils/catchAsyncError";

export const checkWhetherDocumentExists = (ModelName, fieldToCheckAt) =>
  catchAsyncError(async (req, res, next) => {
    const docxExist = await ModelName.findByPk(req.body[fieldToCheckAt]);
    if (!docxExist)
      return next(
        new AppError(
          "Please Check Input / Document Referenced is Not Found",
          405
        )
      );

    next();
  });

export const checkingToWhomDocumentBelongs = (ModelName) =>
  catchAsyncError(async (req, res, next) => {
    const loggedUser = req.loggedUser.id;

    const documentOwner = await ModelName.findByPk(req.params.id);

    if (!documentOwner)
      return next(new AppError("No Document Found With Given ID", 500));
    if (String(loggedUser) !== String(documentOwner.dataValues.userId))
      return next(new AppError("This Document Doesn't Belongs To You", 404));
    next();
  });

export const checkWetherThisBelongsTo = (ModelName) =>
  catchAsyncError(async (req, res, next) => {
    const docxOwner = await ModelName.findByPk(req.params.id);
    if (!docxOwner)
      return next(new AppError("No Document Found With Given ID", 500));
    if (String(req.profile.id) !== String(docxOwner.profileId))
      return next(new AppError("This Document Doesn't Belongs To You", 404));
    next();
  });
