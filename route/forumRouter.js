import { Router } from "express";

import {
  newPost,
  viewAllPost,
  viewPost,
  updatePost,
  deletePost,
  uploadPostImage,

  // Comments
  newComment,
  editComment,
  deleteComment,

  //middleware
  processDataForNewPost,
  preFillerForGettingUser,
  checkPostOwner,
  checkCommentOwner,

  // Login Check
  protectRoute,
  getUser,
} from "./../controller/forumController";

export const forumRouter = Router();

// FORUM POST /Threads
// UsedId Has To Be Automatically generated /Middleware
forumRouter
  .route("/writeNewPost")
  .post(protectRoute, preFillerForGettingUser, processDataForNewPost, newPost);

forumRouter.route("/viewPosts").get(viewAllPost);

forumRouter.route("/viewPost/:id").get(viewPost);

forumRouter
  .route("/editPost/:id")
  .patch(protectRoute, checkPostOwner, updatePost);

forumRouter
  .route("/deletePost/:id")
  .delete(protectRoute, checkPostOwner, deletePost);

// Comments On Post
forumRouter
  .route("/addComment")
  .post(protectRoute, preFillerForGettingUser, newComment);

forumRouter
  .route("/editComment/:id")
  .patch(protectRoute, checkCommentOwner, editComment);

forumRouter
  .route("/deleteComment/:id")
  .delete(protectRoute, checkCommentOwner, deleteComment);
