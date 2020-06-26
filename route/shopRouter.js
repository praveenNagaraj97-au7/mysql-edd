import { Router } from "express";

import {
  addProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,

  //middlware
  processProductData,
} from "./../controller/shopController";

import { protectRoute } from "./../controller/userController";
import { restrictTo } from "./../handlers/userHandler";

export const shopRouter = Router();

shopRouter
  .route("/addProduct")
  .post(
    protectRoute,
    restrictTo("admin", "employee"),
    processProductData,
    addProduct
  );

shopRouter.route("/getAllProducts").get(getAllProducts);

shopRouter.route("/getProduct/:id").get(getProduct);

shopRouter
  .route("/updateProduct/:id")
  .patch(protectRoute, restrictTo("admin", "employee"), updateProduct);

shopRouter
  .route("/deleteProduct/:id")
  .delete(protectRoute, restrictTo("admin", "employee"), deleteProduct);
