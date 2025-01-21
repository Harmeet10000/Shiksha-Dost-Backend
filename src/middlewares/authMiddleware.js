import { promisify } from "util";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { User } from "../models/userModel.js";
import { Mentor } from "../models/mentorModel.js";

export const protect = catchAsync(async (req, res, next) => {
  let token;

  // 1) Check if token is in cookies first
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
    // console.log("JWT token found in cookies:", token);
  }

  // 2) If token is not found in cookies, check the Authorization header
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
    // console.log("JWT token found in Authorization header:", token);
  }

  // 3) If no token is found in either, return an error
  if (!token) {
    return next(
      new AppError("You are not logged in! Please log in to get access.", 401)
    );
  }

  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // 3) Check if user/mentor still exists
  let currentUser;
  if (decoded.role === "mentor") {
    currentUser = await Mentor.findById(decoded.id);
  } else {
    currentUser = await User.findById(decoded.id);
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password! Please log in again.", 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  // console.log("protect", req.user);
  next();
});

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // console.log("restrictTo", req.user);
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
