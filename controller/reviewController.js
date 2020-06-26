import { Review } from "./../model/reviewModel";

import {
  createDocument,
  readAllDocument,
  readDocumentById,
  updateDocumentByID,
  deleteDocumentByID,
} from "./../handlers/factoryHandler";

// Protect Middlewares
export { protectRoute } from "./userController";

// Middlewares
export { preFillerForGettingUser } from "./../middleware/preFillers";

export { getReviewOfCurrentUser } from "./../middleware/preFillers";

import { processDataWithSingleImage } from "./../middleware/imageProcessing";

import { checkingToWhomDocumentBelongs } from "./../middleware/preCheckers";

export const processReviewData = processDataWithSingleImage(
  "reviewImage",
  "mysqlreviewimages"
);
export const writeReview = createDocument(Review, {
  message: "Review Added",
});

export const readAllReview = readAllDocument(Review, {
  message: "List Of Reviews",
});

export const readReview = readAllDocument(Review, {
  message: "Requested Review",
});

export const checkReviewBelongsTo = checkingToWhomDocumentBelongs(Review);
export const updateReview = updateDocumentByID(Review, {
  message: "Review Updated",
});

export const deleteReview = deleteDocumentByID(Review, {
  message: "Review Deleted",
});
