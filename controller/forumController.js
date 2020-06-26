import { Post, Comment } from "./../model/forumModel";

import {
  createDocument,
  readAllDocument,
  readDocumentById,
  updateDocumentByID,
  imageUploader,
  deleteDocumentByID,
} from "./../handlers/factoryHandler";

// restrict Access
export { protectRoute, restrictRoute } from "./userController";

// Middleware
export { preFillerForGettingUser } from "./../middleware/preFillers";
import { processDataWithMultipleImage } from "./../middleware/imageProcessing";

import { checkingToWhomDocumentBelongs } from "./../middleware/preCheckers";

//POST Controller
export const processDataForNewPost = processDataWithMultipleImage(
  "postImages",
  "mysqlforumposts",
  2
);
export const newPost = createDocument(Post, {
  message: "New Post Has Been Added",
});

export const viewAllPost = readAllDocument(Post, {
  message: "List OF Posts",
});

export const viewPost = readDocumentById(Post, {
  message: "Requested Post",
});

export const checkPostOwner = checkingToWhomDocumentBelongs(Post);
export const updatePost = updateDocumentByID(Post, {
  message: "Post Updated Successfully",
});

export const deletePost = deleteDocumentByID(Post, {
  message: "Post Deleted Successfully",
});

//COMMENT Controller
export const newComment = createDocument(Comment, {
  message: "Commented",
});

export const checkCommentOwner = checkingToWhomDocumentBelongs(Comment);
export const editComment = updateDocumentByID(Comment, {
  message: "Comment Edited",
});

export const deleteComment = deleteDocumentByID(Comment, {
  message: "Comment Deleted",
});
