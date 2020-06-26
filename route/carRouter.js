import { Router } from "express";

import {
  addNewCar,
  getAllCar,
  getCar,
  updateCar,
  deleteCar,
  updateCarCoverImage,

  // Attach Car
  attachCar,

  //middleware
  processDataForAddingNewCar,
  carExists,
  processDataForAttachingCar,
  detachCar,
  carAvailable,

  //Security
  protectRoute,
  restrictRoute,
} from "./../controller/carController";

export const carRouter = Router();

carRouter
  .route("/addNewCar")
  .post(
    protectRoute,
    restrictRoute("admin", "employee"),
    processDataForAddingNewCar,
    addNewCar
  );

carRouter.route("/getCars").get(getAllCar);

carRouter.route("/getCar/:id").get(getCar);

carRouter
  .route("/updateCar/:id")
  .patch(protectRoute, restrictRoute("admin", "employee"), updateCar);

carRouter
  .route("/deleteCar/:id")
  .delete(protectRoute, restrictRoute("admin", "employee"), deleteCar);

carRouter.route("/uploadCarCoverImage/:id").patch(updateCarCoverImage);

// Attach
carRouter
  .route("/attachCar")
  .post(
    protectRoute,
    restrictRoute("admin", "employee"),
    carExists,
    processDataForAttachingCar,
    attachCar
  );

carRouter
  .route("/detachCar/:id")
  .delete(protectRoute, restrictRoute("admin", "employee"), detachCar);
