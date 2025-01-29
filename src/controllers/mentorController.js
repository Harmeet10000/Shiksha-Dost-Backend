import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Mentor } from "../models/mentorModel.js";
import { getAll, updateOne } from "./handlerFactory.js";
import mongoose from "mongoose";

export const updateMentor = updateOne(Mentor);

export const getAllMentor = getAll(Mentor);

export const checkUnavailability = catchAsync(async (req, res, next) => {
  const { id } = req.params; // Mentor ID
  const { date, slot } = req.query; // Query parameters
  const userId = req.user._id; // User ID from the authenticated user

  // Validate the mentor ID
  let mentorId;
  try {
    mentorId = new mongoose.Types.ObjectId(id);
  } catch (error) {
    return next(new AppError("Invalid Mentor ID", 400));
  }

  // Convert the date to a Date object
  const queryDate = new Date(date);

  // Run aggregation pipeline to check slot conflicts
  const mentorships = await Mentorship.aggregate([
    {
      $match: {
        mentor: mentorId, // Match the mentor ID
        user: userId, // Match the user ID
        isCompleted: false, // Ensure the session is not completed
        "schedule.on": queryDate, // Match the schedule date
      },
    },
    {
      $addFields: {
        slotConflict: {
          $filter: {
            input: ["$schedule"], // Access the `schedule` array
            as: "schedule",
            cond: {
              $and: [
                { $gte: [slot, "$$schedule.start"] }, // Slot is >= schedule start
                { $lte: [slot, "$$schedule.end"] }, // Slot is <= schedule end
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        slotConflict: 1,
        mentor: 1,
        schedule: 1,
      },
    },
    {
      $match: {
        "slotConflict.0": { $exists: true }, // Ensure at least one conflicting slot exists
      },
    },
  ]);

  // Check if any conflicts exist
  if (mentorships.length > 0) {
    return res.status(200).json({
      status: "success",
      data: {
        isUnavailable: true,
        message: "Mentor is already scheduled at this time slot.",
      },
    });
  }

  // Check unavailability in mentor's schedule
  const mentor = await Mentor.findById(mentorId).select("unavailability");

  if (!mentor) {
    return next(new AppError("No mentor found with that ID", 404));
  }

  const unavailability = mentor.unavailability;

  // Check for conflicts in mentor's unavailability
  const unavailabilityEntry = unavailability.find(
    (entry) =>
      new Date(entry.date).toISOString().split("T")[0] ===
      queryDate.toISOString().split("T")[0]
  );

  if (!unavailabilityEntry) {
    return res.status(200).json({
      status: "success",
      data: {
        isUnavailable: false,
        message: "Mentor is available on this date.",
      },
    });
  }

  // Convert the slot to a time string in 24-hour format for easier comparison
  const slotTime = new Date(`1970-01-01T${slot}`).toLocaleTimeString("en-US", {
    hour12: false,
  });

  // Check if the slot lies between any of the start and end times in the slots array
  const isUnavailable = unavailabilityEntry.slots.some((slotEntry) => {
    const startTime = new Date(
      `1970-01-01T${slotEntry.start}`
    ).toLocaleTimeString("en-US", { hour12: false });
    const endTime = new Date(`1970-01-01T${slotEntry.end}`).toLocaleTimeString(
      "en-US",
      { hour12: false }
    );

    return slotTime >= startTime && slotTime <= endTime;
  });

  // Final response
  res.status(200).json({
    status: "success",
    data: {
      isUnavailable,
      message: isUnavailable
        ? "Mentor is unavailable at this slot."
        : "Mentor is available at this slot.",
      unavailableSlots: isUnavailable ? unavailabilityEntry.slots : [],
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
