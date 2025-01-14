import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  createOne,
} from "./handlerFactory.js";
import { User } from "../models/userModel.js";

// export const uploadUserPhoto = upload.single("photo");

// exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
//   if (!req.file) return next();

//   req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

//   await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat('jpeg')
//     .jpeg({ quality: 90 })
//     .toFile(`Client/public/img/users/${req.file.filename}`);

//   next();
// });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "name", "email", "photo");
  let photo;
  console.log(filteredBody);
  if (req.files) photo = req.files.photo;

  const result = await cloudinary.uploader.upload(photo.tempFilePath);

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    { ...filteredBody, photo: result.url },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const getUserBookings = catchAsync(async (req, res, next) => {
  console.log(req.user.id);
  const loggedUser = await User.findOne({ name: req.user.name }).populate(
    "bookings"
  );

  if (!loggedUser) {
    return next(new Error("No user found with that name"));
  }

  const userResponse = {
    bookings: loggedUser.bookings.map((booking) => ({
      // Assuming bookings have properties you want like id, date etc.
      id: booking._id,
      tour: booking.tour,
      // date: booking.date
    })),
  };

  res.status(200).json({
    status: "success",
    user: userResponse,
  });
});

export const createUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route is not defined! Please use /signup instead",
  });
};

export const getUserStats = catchAsync(async (req, res, next) => {
  const result = await User.aggregate([{ $count: "totalUsers" }]);
  res.status(200).json({ result });
});



export const getUser = getOne(User, { path: "bookings" });
export const getAllUsers = getAll(User, {
  path: "bookings",
  select: "tour",
});

// Do NOT update passwords with this!
export const updateUser = updateOne(User);
export const deleteUser = deleteOne(User);
