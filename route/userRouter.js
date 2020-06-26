import { Router } from "express";

import {
  register,
  login,
  forgotPassword,
  resetPassword,

  // Permission
  protectRoute,

  //middleware
  signUpChecker,

  // Logged Users
  updateMyPassword,
  updateMe,
  getMe,
  deleteMe,
  logoutMe,
  updateProfilePicture,
} from "./../controller/userController";

export const userRouter = Router();

userRouter.route("/signUp").post(signUpChecker, register);

userRouter.route("/login").post(login);

userRouter.route("/forgotPassword").post(forgotPassword);

userRouter.route("/resetPassword/:token").patch(resetPassword);

userRouter.route("/updatePassword").patch(protectRoute, updateMyPassword);

userRouter.route("/updateMe").patch(protectRoute, updateMe);

userRouter.route("/getMe").get(protectRoute, getMe);

userRouter.route("/deleteMe").delete(protectRoute, deleteMe);

userRouter.route("/logout").post(protectRoute, logoutMe);

userRouter.route("/uploadProfilePic").post(protectRoute, updateProfilePicture);
