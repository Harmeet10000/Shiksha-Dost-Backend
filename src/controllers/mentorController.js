import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Mentor } from "../models/mentorModel.js";


export const getAllMentor = catchAsync(async (req, res, next) => {
  const mentors = await Mentor.find();

  if (!mentors) {
    return next(new AppError("No mentors found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      mentors,
    },
  });
});