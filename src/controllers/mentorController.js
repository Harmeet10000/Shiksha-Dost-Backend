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

export const unavailabilityUpdate = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { unavailability } = req.body;

  if (!unavailability || !Array.isArray(unavailability)) {
    return next(new AppError("Invalid or missing 'unavailability' data.", 400));
  }

  // Validate the structure of unavailability
  const isValid = unavailability.every(
    (item) =>
      item.date &&
      Array.isArray(item.slots) &&
      item.slots.every((slot) => slot.start && slot.end)
  );

  if (!isValid) {
    return next(new AppError("Invalid 'unavailability' structure.", 400));
  }

  const now = new Date();

  // Ensure no past dates
  const hasPastDates = unavailability.some((item) => new Date(item.date) < now);
  if (hasPastDates) {
    return next(
      new AppError("Unavailability contains dates in the past.", 400)
    );
  }

  // Retrieve mentor from the database
  const mentor = await Mentor.findById(id);
  if (!mentor) {
    return next(new AppError("Mentor not found.", 404));
  }

  // Update unavailability
  const existingUnavailability = mentor.unavailability || [];
  unavailability.forEach((newItem) => {
    const incomingDate = new Date(newItem.date);
    incomingDate.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison

    // Find the existing item with the same date
    const existingItem = existingUnavailability.find(
      (item) =>
        new Date(item.date).setHours(0, 0, 0, 0) === incomingDate.getTime()
    );

    if (existingItem) {
      // Check if all slots already exist
      const allSlotsExist = newItem.slots.every((newSlot) =>
        existingItem.slots.some(
          (existingSlot) =>
            existingSlot.start === newSlot.start &&
            existingSlot.end === newSlot.end
        )
      );

      if (allSlotsExist) {
        return next(
          new AppError(
            `The date ${newItem.date} with these slots already exists.`,
            400
          )
        );
      }

      // Add new slots
      newItem.slots.forEach((newSlot) => {
        const slotExists = existingItem.slots.some(
          (existingSlot) =>
            existingSlot.start === newSlot.start &&
            existingSlot.end === newSlot.end
        );
        if (!slotExists) {
          existingItem.slots.push(newSlot);
        }
      });
    } else {
      // Add new date and slots
      existingUnavailability.push(newItem);
    }
  });

  // Save updated unavailability
  mentor.unavailability = existingUnavailability;
  await mentor.save();

  res.status(200).json({
    status: "success",
    message: "Unavailability updated successfully.",
    data: mentor,
  });
});


