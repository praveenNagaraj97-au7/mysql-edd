//PreFillers

import { catchAsyncError } from "../utils/catchAsyncError";
import { AppError } from "../utils/appError";

export const preFillerForGettingUser = (req, res, next) => {
  req.body.userId = req.loggedUser.id;
  next();
};

export const getReviewOfCurrentUser = (req, res, next) => {
  req.query.userId = req.loggedUser.id;
  next();
};

export const setUserForUpdatingProfilePic = (req, res, next) => {
  req.params.id = req.loggedUser._id;
  next();
};

export const setTodoTime = (req, res, next) => {
  req.body.whatTime =
    req.body.whichDate + " " + req.body.whatTime + ".000+05:30";
  next();
};

export const setProfileId = (ModelName) =>
  catchAsyncError(async (req, res, next) => {
    const profile = await ModelName.findOne({ userId: req.loggedUser._id });
    if (!profile)
      return next(
        new AppError("Please Create A Social Media Account With Us", 401)
      );
    req.body.profileId = profile._id;
    next();
  });

export const getProfile = (ModelName) =>
  catchAsyncError(async (req, res, next) => {
    const profile = await ModelName.findOne({ userId: req.loggedUser._id });
    if (!profile)
      return next(
        new AppError("Please Create A Social Media Account With Us", 401)
      );
    req.profile = profile;
    next();
  });

export const preFillPostForCommentingAndLiking = (req, res, next) => {
  req.body.postId = req.params.id;
  req.body.profileId = req.profile._id;
  next();
};

export const preFillFriendId = (req, res, next) => {
  req.body.friendId = req.params.id;
  next();
};
