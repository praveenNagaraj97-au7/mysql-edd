import { catchAsyncError } from "./../utils/catchAsyncError";
import { AppError } from "./../utils/appError";
import { ApiFeatures } from "./../utils/apiFeatures";

import {
  storageBucket,
  createBucket,
  uploadImage,
} from "./../utils/googleCloudImageBucket";

export const createDocument = (Modelname, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const docx = await Modelname.create(req.body);
    responseObj.docx = docx;
    res.status(201).json(responseObj);
  });

export const readAllDocument = (Modelname, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const modelleddata = new ApiFeatures(Modelname, req.query)
      .filter()
      .sort()
      .pagination()
      .limitFields();

    const docx = await modelleddata.result;
    if (docx.length < 1) return next(new AppError("No Documents Found", 200));
    responseObj.results = docx.length;
    responseObj.docx = docx;
    res.status(302).json(responseObj);
  });

export const readDocumentById = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const docx = await ModelName.findByPk(req.params.id);

    if (!docx || docx.length < 1)
      return next(new AppError("No Document Found", 500));

    responseObj.docx = docx;
    res.status(302).json(responseObj);
  });

export const updateDocumentByID = (Modelname, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const docxCheck = await Modelname.findByPk(req.params.id);
    if (req.params.id != docxCheck.id)
      return next(new AppError("No Document Found With The Given ID", 404));

    const docx = await Modelname.update(req.body, {
      returning: true,
      where: { id: req.params.id },
    });
    docx[0] == 0
      ? (responseObj.status = "Document Not Changed As No Values Were Passed")
      : (responseObj.status = "Documet Changed Successfully");
    responseObj.docx = docx[1];
    if (docx.length === 1) responseObj.message = undefined;
    res.status(200).json(responseObj);
  });

export const deleteDocumentByID = (Modelname, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const docxCheck = await Modelname.findByPk(req.params.id);

    if (req.params.id != docxCheck.id)
      return next(new AppError("No Document Found With The Given ID", 404));

    await Modelname.destroy({ where: { id: req.params.id } });

    res.status(200).json(responseObj);
  });

// Advanced Handlers

export const imageUploader = (
  ModelName,
  folderName,
  imageFieldName,
  responseObj
) =>
  catchAsyncError(async (req, res, next) => {
    if (req.files.length > 1)
      return next(new AppError("Please Select One Image!", 205));
    const checkExist = await ModelName.findByPk(req.params.id);
    if (req.params.id != checkExist.id)
      return next(
        new AppError("No Document Found With Given ID to Upload Image", 500)
      );

    let folder;
    try {
      folder = await createBucket(folderName);
    } catch (err) {
      if (err.code == 409) {
        folder = folderName;
      }
    }
    req.files[0].originalname =
      Math.random().toString(36).substring(2, 15) + req.files[0].originalname;

    const googleStorage = storageBucket(folder);
    const publicUrl = await uploadImage(req.files[0], googleStorage);
    if (!publicUrl) return next(new AppError("Image Upload Failed", 500));

    const docx = await ModelName.update(
      { [imageFieldName]: publicUrl },
      {
        returning: true,
        where: { id: req.params.id },
      }
    );

    responseObj.docx = docx[1];
    res.status(200).json(responseObj);
  });

export const uploadImageBehindTheRequest = async (file, bucketFolderName) => {
  let folder;
  try {
    folder = await createBucket(bucketFolderName);
  } catch (err) {
    if (err.code == 409) {
      folder = bucketFolderName;
    }
  }
  const googleStorage = storageBucket(folder);
  const publicUrl = await uploadImage(file, googleStorage);

  return publicUrl;
};
