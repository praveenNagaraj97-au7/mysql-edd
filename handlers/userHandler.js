import { AppError } from "./../utils/appError";
import { catchAsyncError } from "./../utils/catchAsyncError";

import {
  JWTTokenGen,
  JWTTokenVerify,
  JWTTimeStampCheck,
} from "./../utils/jwtPromiseFunctions";

import {
  storageBucket,
  createBucket,
  uploadImage,
} from "./../utils/googleCloudImageBucket";

import { passwordVerify, passwordHasher } from "./../model/userModel";

import { mailer } from "./../utils/nodeMailer";

const cookieSender = (res, name, value) =>
  res.cookie(name, value, {
    maxAge: Number(process.env.COOKIE_EXPIRES),
    httpOnly: true,
    secure: true,
  });

export const signUpChecker = (req, res, next) => {
  if (req.body.role) {
    if (!req.body.joinCommunity)
      return next(new AppError("You Cannot Join Our Community", 404));
    if (req.body.joinCommunity != process.env.JOIN_COMMUNITY)
      return next(new AppError("Contact admin for Joining Our Community", 404));
  }
  next();
};

export const signUp = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const user = await ModelName.create(req.body);
    if (!user) return next(new AppError("Registration Failed", 500));

    const token = await JWTTokenGen(user.id);
    cookieSender(res, "jwt", token);
    responseObj.token = token;
    responseObj.user = user;

    res.status(201).json(responseObj);
  });

export const signIn = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    if (!req.body.email || !req.body.password)
      return next(new AppError("Please Enter Email and Password", 500));
    const user = await ModelName.findOne({ where: { email: req.body.email } });
    if (!user)
      return next(new AppError(`No User Found With ${req.body.email}`, 404));
    if (!(await passwordVerify(String(req.body.password), user.password)))
      return next(new AppError("Enter Password Is Wrong", 401));

    const token = await JWTTokenGen(user.id);
    cookieSender(res, "jwt", token);
    responseObj.token = token;
    responseObj.user = user;

    res.status(200).json(responseObj);
  });

export const forgotUserPassword = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    if (!req.body.email) return next(new AppError("Please Enter mail ID", 500));
    const user = await ModelName.findOne({ where: { email: req.body.email } });
    if (!user)
      return next(
        new AppError(`${req.body.email} is Not Registered Please SignUp`, 500)
      );

    const token = await JWTTokenGen(user.id, 60 * 10);

    const resetUrl = `{{START}}/user/resetPassword/${token}`;
    const resetUrlMail = `localhost:3000/v1/ExploreDreamDiscover/resetPassword/${token}`;
    const options = {
      email: user.email,
      subject: "Password Reset Token Valid For 10 Minutes Only",
      message: resetUrlMail,
    };
    await mailer(options);

    responseObj.resetUrl = resetUrl;
    res.status(200).json(responseObj);
  });

// Reset takes jwt token that was sent and verify the token and it's timestamp.
// One it's correct it will find id of user from jwt and updates there password.

export const resetUserPassword = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    if (!req.body.password || !req.body.confirmPassword)
      return next(new AppError("Please Enter Password To reset"));

    const decode = await JWTTokenVerify(req.params.token);

    const check = await JWTTimeStampCheck(decode.iat, decode.exp);

    if (!check) return next(new AppError("Password Reset Token Expired", 500));

    const user = await ModelName.findByPk(decode.id);
    if (req.body.password !== req.body.confirmPassword)
      return next(
        new AppError("Password and Confirm Password Didn't match", 500)
      );

    user.password = await passwordHasher(req.body.password);

    user.confirmPassword = "";

    await user.save();

    const token = await JWTTokenGen(user._id);
    cookieSender(res, "jwt", token);
    responseObj.user = user;
    responseObj.token = token;

    res.status(200).json(responseObj);
  });

// Will Check Whether User is Logged In Or Not Using Bearer-Token and JWt verify
export const protect = (ModelName) =>
  catchAsyncError(async (req, res, next) => {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer")
    ) {
      return next(new AppError("You Are Not Logged In Please Log-In", 401));
    }

    const token = req.headers.authorization.split(" ")[1];

    const decode = await JWTTokenVerify(token);
    if (!decode) return next(new AppError(`This ${token} is Invalid`));

    const timeStampCheck = await JWTTimeStampCheck(decode.iat, decode.exp);

    if (!timeStampCheck) return next(new AppError("Please Log In Again", 401));

    const loggedUser = await ModelName.findByPk(decode.id);

    if (!loggedUser) return next(new AppError("User Doesn't Exist", 404));

    // IS Password Modified Check
    // Additional Check
    if (loggedUser.passwordModified !== null) {
      if (
        parseInt(loggedUser.passwordModified.getTime() / 1000, 10) > decode.iat
      ) {
        return next(
          new AppError(
            "Password was changed recently - Please Login Again",
            401
          )
        );
      }
    }

    req.loggedUser = loggedUser;
    next();
  });

// Restrict-To will Restrict Some Routers restricted for Other Users
// This Will Be Used In Router
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.loggedUser.role)) next();
    else next(new AppError("You Are Not Allowed to this Operation", 404));
  };
};

// Update My Password after LoggedIn
export const updateLoggedInUserPassword = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const user = await ModelName.findByPk(req.loggedUser.id);

    console.log(user.password);
    if (
      !(await passwordVerify(String(req.body.currentPassword), user.password))
    ) {
      res.token = undefined;
      res.clearCookie("jwt");
      return next(
        new AppError(
          `You Are Not Authorized TO Change Password Logging You Out For Security Purpose`,
          404
        )
      );
    }

    user.password = await passwordHasher(req.body.password);
    user.confirmPassword = "";

    await user.save();
    responseObj.status = `Your New Password is ${req.body.password}`;
    responseObj.user = user;
    res.status(202).json(responseObj);
  });

export const updateUserDetails = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    if (req.body.role) {
      if (!req.body.joinCommunity)
        return next(new AppError("You Cannot Join Our Community", 404));
      if (req.body.joinCommunity != process.env.JOIN_COMMUNITY)
        return next(
          new AppError("Contact admin for Joining Our Community", 404)
        );
    }

    if (req.body.password)
      return next(
        new AppError(
          "You Are Not Allowed To Change Password Here Please Use Change Password Option",
          403
        )
      );

    if (req.body.drivingLicence) req.body.bookingAccess = true;

    const user = await ModelName.findByPk(req.loggedUser.id);

    await user.update(req.body);

    responseObj.updatedDetails = user;
    responseObj.updatedValues = req.body;

    res.status(202).json(responseObj);
  });

export const getLoggedUser = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    const user = await ModelName.findByPk(req.loggedUser.id);
    responseObj.details = user;
    res.status(200).json(responseObj);
  });

export const deleteLoggedUser = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    await ModelName.destroy({
      where: { id: req.loggedUser.id },
    });
    res.status(202).json(responseObj);
  });

export const logOutUser = (ModelName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    await ModelName.findByPk(req.loggedUser.id);

    res.clearCookie("jwt");
    responseObj.token = undefined;

    res.status(200).json(responseObj);
  });

// Advanced Handlers

export const imageUploader = (ModelName, folderName, responseObj) =>
  catchAsyncError(async (req, res, next) => {
    let folder;
    try {
      folder = await createBucket(folderName);
    } catch (err) {
      if (err.code == 409) {
        folder = folderName;
      }
    }

    const googleStorage = storageBucket(folder);
    const publicUrl = await uploadImage(req.file, googleStorage);
    if (!publicUrl) return next(new AppError("Image Upload Failed", 500));

    const docx = await ModelName.update(
      { profilePic: publicUrl },
      {
        returning: true,
        where: { id: req.loggedUser.id },
      }
    );
    responseObj.user = docx[1];
    res.status(200).json(responseObj);
  });
