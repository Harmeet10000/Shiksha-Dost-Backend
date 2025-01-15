import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import {
  getAll,
  getOne,
  deleteOne,
  updateOne,
  createOne,
  blockOne,
} from "./handlerFactory.js";
import { User } from "../models/userModel.js";
import { Mentor } from "../models/mentorModel.js";

export const blockMentor = blockOne(Mentor);
export const deleteMentor = deleteOne(Mentor);

export const blockStudent = blockOne(User);
export const deleteStudent = deleteOne(User);


// export const updateMe = catchAsync(async (req, res, next) => {

//   // 2) Filtered out unwanted fields names that are not allowed to be updated
//    let photo;
//    if (req.files) photo = req.files.photo;

//   const result = await cloudinary.uploader.upload(photo.tempFilePath);

//   // 3) Update user document
//   const updatedUser = await User.findByIdAndUpdate(
//     req.user.id,
//     { ...filteredBody, photo: result.url },
//     {
//       new: true,
//       runValidators: true,
//     }
//   );

//   res.status(200).json({
//     status: "success",
//     data: {
//       user: updatedUser,
//     },
//   });
// });

// export const getUserStats = catchAsync(async (req, res, next) => {
//   const result = await User.aggregate([{ $count: "totalUsers" }]);
//   res.status(200).json({ result });
// });

// export const getUser = getOne(User, { path: "bookings" });

// // Do NOT update passwords with this!
// export const updateUser = updateOne(User);
