import { Router } from "express";

import {
  writeReview,
  readAllReview,
  readReview,
  updateReview,
  deleteReview,

  //Middlewares
  preFillerForGettingUser,
  processReviewData,
  checkReviewBelongsTo,
  getReviewOfCurrentUser,

  // Access Check
  protectRoute,
} from "./../controller/reviewController";

export const reviewRouter = Router();

reviewRouter
  .route("/writeReview")
  .post(protectRoute, preFillerForGettingUser, processReviewData, writeReview);

reviewRouter.route("/viewAllReview").get(readAllReview);

reviewRouter
  .route("/getMyReview")
  .get(protectRoute, getReviewOfCurrentUser, readReview);

reviewRouter
  .route("/updateReview/:id")
  .patch(protectRoute, checkReviewBelongsTo, updateReview);

reviewRouter
  .route("/deleteReview/:id")
  .delete(protectRoute, checkReviewBelongsTo, deleteReview);
