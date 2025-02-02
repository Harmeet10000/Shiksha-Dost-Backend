import crypto from "crypto";
import jwt from "jsonwebtoken";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Resendmail } from "../helpers/email.js";
import { Mentor } from "../models/mentorModel.js";
import { User } from "../models/userModel.js";
import { oauth2Client } from "../config/auth.js";
import { googleConfig } from "../config/googleConfig.js";

//Generate JWT token
const signToken = (id, role) => {
  // eslint-disable-next-line no-undef
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    // eslint-disable-next-line no-undef
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);
  const cookieOptions = {
    expires: new Date(
      // eslint-disable-next-line no-undef
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  // eslint-disable-next-line no-undef
  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);
  // console.log("Set-Cookie headers:", res.getHeaders()["set-cookie"]);

  // Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    result: {
      user,
    },
  });
};

const createSendEmail = async (user, req, next) => {
  try {
    const verificationToken = user.createEmailVerificationToken();

    console.log(verificationToken);
    await user.save({ validateBeforeSave: false });
    // eslint-disable-next-line no-undef
    const verificationURL = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    console.log(verificationURL);
    let info = {
      name: user.name,
      to: user.email,
      verificationURL: verificationURL,
      role: user.role,
      use: "signup",
    };

    await Resendmail(info);
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
};

export const signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  await createSendEmail(newUser, req, next);
  createSendToken(newUser, 201, res);
});

// eslint-disable-next-line no-unused-vars
export const signupMentor = catchAsync(async (req, res, next) => {
  const newUser = await Mentor.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  // console.log(newUser.name, newUser.email, newUser.role);
  let info = {
    name: newUser.name,
    password: req.body.password,
    to: newUser.email,
    verificationURL: "",
    role: newUser.role,
    use: "signup",
  };
  await Resendmail(info);
  createSendToken(newUser, 201, res);
});

// eslint-disable-next-line no-unused-vars
export const verifyEmail = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token.trim())
    .digest("hex");
  console.log("HT", hashedToken);

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });
  console.log("User", user);
  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Token is invalid or has expired",
    });
  }
  user.isVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Email verified successfully!",
  });
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password!", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password", 401));

  createSendToken(user, 200, res);
});

export const loginMentor = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("Please provide email and password!", 400));

  const user = await Mentor.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Incorrect email or password", 401));

  createSendToken(user, 200, res);
});

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with email address.", 404));
  }

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await Resendmail({
      email: user.email,
      subject: "Your password reset token (valid for 10 min)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // res.json({message:err});
    return next(
      new AppError("There was an error sending the email. Try again later!"),
      500
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select("+password");
  console.log(user);
  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong.", 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  createSendToken(user, 200, res);
});

export const getAuthUrl = (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: googleConfig.scopes,
  });
  res.redirect(authUrl);
};

export const handleCallback = async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Store tokens in your database here
    // You might want to associate them with a user session

    const payload = {
      googleTokens: tokens,
      //  userId: req.user.id, // Your app's user ID
    };
    console.log("payload", payload);

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const cookieOptions = {
      expires: new Date(
        // eslint-disable-next-line no-undef
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };
    // eslint-disable-next-line no-undef
    if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

    res.cookie("Gtoken", token, cookieOptions);

    res.json({
      message: "Authentication successful",
    });
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.status(500).send("Authentication failed");
  }
};
