import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Mentor } from "../models/mentorModel.js";
import { getS3URL, uploadToS3 } from "../helpers/s3.js";
import mongoose from "mongoose";

const updateMentorsWithSignedURLs = (mentors) => {
  return Promise.all(
    mentors.map((mentor) => {
      return getS3URL(mentor.profile_image)
        .then((signedUrl) => {
          // console.log("Signed URL:", signedUrl);

          return {
            ...mentor._doc, // Use `_doc` for plain object in Mongoose
            profile_image: signedUrl,
          };
        })
        .catch((err) => {
          console.error(
            `Error generating signed URL for ${mentor.profile_image}`,
            err
          );
          return mentor;
        });
    })
  );
};

export const getUnavailability = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  let objectId;
  try {
    objectId = new mongoose.Types.ObjectId(id); // Convert to ObjectId
  } catch (error) {
    return next(new AppError("Invalid Mentor ID", 400)); // Handle invalid ObjectId
  }
  
  const mentor = await Mentor.aggregate([
    {
      $match: { _id: objectId },
    },
    {
      $project: {
        _id: 0,
        unavailability: 1,
      },
    },
  ]);

  if (!mentor || mentor.length === 0) {
    return next(new AppError("No mentor found with that ID", 404));
  }

  const unavailability = mentor[0].unavailability;

  res.status(200).json({
    status: "success",
    data: {
      unavailability,
    },
  });
});

export const getAllMentor = catchAsync(async (req, res, next) => {
  const mentors = await Mentor.find();
  console.log("Mentors", mentors);

  if (!mentors) {
    return next(new AppError("No mentors found", 404));
  }

  const updatedMentors = await updateMentorsWithSignedURLs(mentors);

  res.status(200).json({
    status: "success",
    data: {
      mentors: updatedMentors,
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
  await uploadToS3(req.file, mentors);

  const updatedMentor = await Mentor.findByIdAndUpdate(
    id,
    {
      ...(bio && { bio }),
      ...(description && { description }),
      ...(skills && { skills }),
      ...(file.originalname && { profile_image: file.originalname }),
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

export const removeUnavailability = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { date, slots } = req.body;

  if (!date && !slots) {
    return next(
      new AppError("Please provide a 'date' or 'slots' to remove.", 400)
    );
  }

  const mentorResult = await Mentor.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(id) },
    },
    {
      $project: {
        unavailability: 1,
      },
    },
  ]);

  if (!mentorResult || mentorResult.length === 0) {
    return next(new AppError("Mentor not found.", 404));
  }

  const mentor = mentorResult[0];

  // Parse and normalize date for comparison
  const incomingDate = new Date(date);
  incomingDate.setHours(0, 0, 0, 0); // Normalize to midnight for accurate comparison

  // Find the unavailability item by date
  const existingUnavailability = mentor.unavailability || [];
  const existingItemIndex = existingUnavailability.findIndex(
    (item) =>
      new Date(item.date).setHours(0, 0, 0, 0) === incomingDate.getTime()
  );

  if (existingItemIndex === -1) {
    return next(new AppError("Unavailability date not found.", 404));
  }

  const existingItem = existingUnavailability[existingItemIndex];

  // If only a date is provided, remove the entire date
  if (date && !slots) {
    existingUnavailability.splice(existingItemIndex, 1);
  }

  // If slots are provided, remove specific slots for the date
  if (slots && Array.isArray(slots)) {
    slots.forEach((slot) => {
      const slotIndex = existingItem.slots.findIndex(
        (existingSlot) =>
          existingSlot.start === slot.start && existingSlot.end === slot.end
      );

      if (slotIndex !== -1) {
        existingItem.slots.splice(slotIndex, 1);
      }
    });

    // Remove the entire date if no slots are left
    if (existingItem.slots.length === 0) {
      existingUnavailability.splice(existingItemIndex, 1);
    }
  }

  await Mentor.updateOne(
    { _id: id },
    { $set: { unavailability: existingUnavailability } }
  );

  res.status(200).json({
    status: "success",
    message: "Unavailability updated successfully.",
    data: mentor,
  });
});
