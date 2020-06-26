import { User } from "./../model/userModel";

import {
  signUp,
  signIn,
  forgotUserPassword,
  resetUserPassword,

  // Additional
  protect,
  restrictTo,

  // LoggedUser
  updateLoggedInUserPassword,
  updateUserDetails,
  getLoggedUser,
  deleteLoggedUser,
  logOutUser,

  // Advanced
  imageUploader,
} from "./../handlers/userHandler";

// Middlware
import { processDataWithSingleImage } from "./../middleware/imageProcessing";
export { signUpChecker } from "./../handlers/userHandler";

// Protect Access
export const restrictRoute = restrictTo;
export const protectRoute = protect(User);

export const registrationData = processDataWithSingleImage(
  "profilePic",
  "mysqluserprofilepic"
);

export const register = signUp(User, {
  message: "Sign Up Successfully",
});

export const login = signIn(User, {
  message: "Logged In Successfully",
});

export const forgotPassword = forgotUserPassword(User, {
  message: "Reset Password Link TO Your Mail",
});

export const resetPassword = resetUserPassword(User, {
  message: "Password Changed Successfully",
});

export const updateMyPassword = updateLoggedInUserPassword(User, {
  message: "Password Changed Successfully",
});

export const updateMe = updateUserDetails(User, {
  message: "Details Updated Successfully",
});

export const getMe = getLoggedUser(User, {
  message: "Your Profile",
});

export const deleteMe = deleteLoggedUser(User, {
  message: "See You Soon",
});

export const logoutMe = logOutUser(User, {
  message: "Successfully LoggedOut",
});

export const updateProfilePicture = imageUploader(User, "sqluser", {
  message: "Profile Picture Uploaded Successfully",
});
