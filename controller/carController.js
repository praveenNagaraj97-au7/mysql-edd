import { Car, AttachCar } from "./../model/carModel";

import {
  createDocument,
  readAllDocument,
  updateDocumentByID,
  deleteDocumentByID,
  readDocumentById,

  // Advanced
  imageUploader,
} from "./../handlers/factoryHandler";

// Protect Routes
export { protectRoute, restrictRoute } from "./userController";

// Image Process

import {
  processDataWithMultipleImage,
  processDataWithSingleImage,
} from "./../middleware/imageProcessing";

import { checkWhetherDocumentExists } from "./../middleware/preCheckers";

export const processDataForAddingNewCar = processDataWithSingleImage(
  "carCoverImage",
  "mysqlcarrentalcover"
);

export const addNewCar = createDocument(Car, {
  message: "New Car added",
});

export const updateCarCoverImage = imageUploader(
  Car,
  "mysqlcarrentalcover",
  "carCoverImage",
  {
    message: "Successfully Added Car Cover Image",
  }
);

export const getAllCar = readAllDocument(Car, {
  message: "List Of Cars",
});

export const getCar = readDocumentById(Car, {
  message: "Requested Car",
});

export const updateCar = updateDocumentByID(Car, {
  message: "Updated Car Details Succecssfully",
});

export const deleteCar = deleteDocumentByID(Car, {
  message: "Car Delete Successfully",
});

// Attach Cars

export const carExists = checkWhetherDocumentExists(Car, "carId");

export const processDataForAttachingCar = processDataWithMultipleImage(
  "carImages",
  "mysqlattachedcars",
  5
);

export const attachCar = createDocument(AttachCar, {
  message: "Car Attached Successfully",
});

export const detachCar = deleteDocumentByID(AttachCar, {
  message: "Car Detached Successfully",
});
