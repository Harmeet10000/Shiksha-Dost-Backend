import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Mentorship } from "../models/mentorshipModel.js";
import { Resendmail } from "../helpers/email.js";

export const createMentorship = catchAsync(async (req, res, next) => {
  const { date, slot, time, mentorId, razorpay_order_id } = req.body;

  // Validate the required fields
  if (!date || !slot || !time || !mentorId) {
    return next(
      new AppError("All fields (date, slot, time, mentorId) are required", 400)
    );
  }

  // Define durations
  const timeDurations = {
    "10 min": 10,
    "30 min": 30,
    "1 hr": 60,
  };

  const duration = timeDurations[time];
  if (!duration) {
    return next(new AppError("Invalid time duration provided", 400));
  }

  // Convert slot to 24-hour format
  const [timeString, modifier] = slot.split(" "); // e.g., "09:00 AM" -> ["09:00", "AM"]
  let [hours, minutes] = timeString.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) hours += 12; // Convert PM times
  if (modifier === "AM" && hours === 12) hours = 0; // Convert 12 AM to 00:00

  const startTime = new Date(
    `1970-01-01T${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:00`
  );
  if (isNaN(startTime)) {
    return next(
      new AppError("Invalid slot format. Use HH:mm AM/PM format", 400)
    );
  }

  // Calculate the end time
  const endTime = new Date(startTime.getTime() + duration * 60000);

  // Format times as HH:mm AM/PM
  const formattedStartTime = startTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const formattedEndTime = endTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  // Create the mentorship document
  const mentorship = await Mentorship.create({
    user: req.user._id, // Authenticated user ID
    mentor: mentorId,
    razorpay_order_id: razorpay_order_id,
    schedule: {
      on: new Date(date), // Store the date
      start: formattedStartTime, // Store the start time
      end: formattedEndTime, // Store the end time
    },
  });

  // Respond with the created mentorship
  res.status(201).json({
    status: "success",
    data: {
      mentorship,
    },
  });
});

export const sendMeetMail = catchAsync(async (req, res, next) => {
  const { userId, mentorId } = req.body;

  const mentorship = await Mentorship.findOne({
    user: userId,
    mentor: mentorId,
  })

  const { user, mentor, schedule, meetingLink } = mentorship;

  const userEmailData = {
    name: user.name,
    to: user.email,
    profile_imageURL: user.profile_imageURL,
    schedule: schedule,
    meetingLink: meetingLink,
    role: "student",
    use: "meeting",
  };

  const mentorEmailData = {
    name: mentor.name,
    to: mentor.email,
    profile_imageURL: mentor.profile_imageURL,
    schedule: schedule,
    meetingLink: meetingLink,
    role: "mentor",
    use: "meeting",
  };

  // Function to send email to both user and mentor
  const sendEmailPromises = [
    Resendmail(userEmailData),
    Resendmail(mentorEmailData),
  ];

  // Wait for both emails to be sent
  await Promise.all(sendEmailPromises);

  // Send back a 200 response after both emails are sent
  res.status(200).json({
    success: true,
    message: "Meeting emails sent successfully",
  });
});
