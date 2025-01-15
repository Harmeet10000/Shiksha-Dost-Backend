import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Mentor } from "../models/mentorModel.js";
import { uploadToS3 } from "../services/s3.js";

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

export const updateMentor = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { bio, description, skills } = req.body;
  const file = req.file;

  if (!file) {
    return next(new AppError("No file uploaded.", 400));
  }
  await uploadToS3(req.file);
  const BUCKET_NAME = "shikshadost-studymaterial";
  const BUCKET_REGION = "ap-south-1";
  const profileImageURL = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${file.originalname}`;
  // console.log("s3URL", profileImageURL);

  const updatedMentor = await Mentor.findByIdAndUpdate(
    id,
    {
      ...(bio && { bio }),
      ...(description && { description }),
      ...(skills && { skills }),
      ...(profileImageURL && { profile_image: profileImageURL }),
    },
    { new: true, runValidators: true }
  );

  if (!updatedMentor) {
    return next(new AppError("No mentor found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      mentor: updatedMentor,
    },
  });
});
