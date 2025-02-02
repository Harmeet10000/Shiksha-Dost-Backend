import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Mentorship } from "../models/mentorshipModel.js";
import { Resendmail } from "../helpers/email.js";
import { calendar } from "../config/auth.js";

export const createMentorship = catchAsync(async (req, res, next) => {
  const { date, slot, time, mentorId, userPhone, razorpay_order_id } = req.body;
  console.log(req.body);

  // Validate the required fields
  if (!date || !slot || !time || !mentorId) {
    return next(
      new AppError("All fields (date, slot, time, mentorId) are required", 400)
    );
  }

  // Define durations
  const timeDurations = {
    "10 min": 10,
    "15 min": 15,
    "20 min": 20,
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

  // Create the Zoom meeting link
  const { meetingLink, startTime: meetingStartTime } = await createMeetLink({
    date,
    slot,
    time,
  });
  // console.log("meetdetails",meetingLink, meetingStartTime);

  // Create the mentorship document
  const mentorship = await Mentorship.create({
    user: req.user._id, // Authenticated user ID
    mentor: mentorId,
    razorpay_order_id: razorpay_order_id,
    userPhone: userPhone,
    schedule: {
      on: new Date(date), // Store the date
      start: formattedStartTime, // Store the start time
      end: formattedEndTime, // Store the end time
    },
    meetDetails: {
      link: meetingLink,
      startTime: meetingStartTime,
    },
  });
  // console.log("Mentorship created successfully:", mentorship);

  // Respond with the created mentorship
  res.status(201).json({
    status: "success",
    data: {
      mentorship,
    },
  });
});

// Helper to get Zoom access token
const getZoomAccessToken = async () => {
  const authHeader =
    "Basic " +
    Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
    ).toString("base64");

  try {
    const response = await fetch(
      `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${process.env.ZOOM_ACCOUNT_ID}`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (!response.ok) throw new AppError("Token request failed");
    const data = await response.json();
    // console.log("Zoom access token:", data.access_token);
    return data.access_token;
  } catch (error) {
    throw new AppError("Failed to get Zoom access token");
  }
};

// Helper: Convert AM/PM time to 24h format
const parseSlot = (slot) => {
  const [time, modifier] = slot.split(" ");
  let [hours, minutes] = time.split(":").map(Number);

  // Handle 12-hour format conversion
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return { hours, minutes };
};

// Main function
const createMeetLink = async ({ date, slot, time }) => {
  try {
    const FIXED_TOPIC = `Mentorship session scheduled on ${date}, ${slot}`;

    // Parse input parameters
    const { hours, minutes } = parseSlot(slot);
    const duration = parseInt(time.match(/\d+/)[0], 10); // Extract numbers from "30 min"

    // Create IST datetime string (YYYY-MM-DDTHH:mm:ss)
    const istDateTime =
      `${date}T${String(hours).padStart(2, "0")}:` +
      `${String(minutes).padStart(2, "0")}:00`;

    // Get Zoom access token
    const accessToken = await getZoomAccessToken();

    // Create Zoom meeting
    const response = await fetch("https://api.zoom.us/v2/users/me/meetings", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        topic: FIXED_TOPIC,
        type: 2,
        start_time: istDateTime, // Local IST time
        duration,
        timezone: "Asia/Kolkata", // Explicit timezone declaration
        settings: {
          join_before_host: true,
          waiting_room: false,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Zoom API Error: ${errorData.message}`);
    }

    const meetingData = await response.json();

    // Return IST time with offset for clarity
    return {
      meetingLink: meetingData.join_url,
      startTime: `${istDateTime}+05:30`,
      topic: FIXED_TOPIC,
    };
  } catch (error) {
    throw new Error(`Meeting creation failed: ${error.message}`);
  }
};

export const sendMeetMail = catchAsync(async (mentorship) => {
  const { user, mentor, schedule, meetDetails, paymentDetails } = mentorship;

  const userEmailData = {
    name: user.name,
    to: user.email,
    profile_imageURL: user.profile_imageURL,
    schedule: schedule,
    meetingLink: meetDetails.link,
    razorpay_order_id: paymentDetails.razorpay_order_id.toString(),
    razorpay_payment_id: paymentDetails.razorpay_payment_id.toString(),
    razorpay_signature: paymentDetails.razorpay_signature.toString(),
    role: "student",
    use: "meeting",
  };

  const mentorEmailData = {
    name: mentor.name,
    to: mentor.email,
    profile_imageURL: mentor.profile_imageURL,
    schedule: schedule,
    meetingLink: meetDetails.link,
    role: "mentor",
    use: "meeting",
  };
  // console.log(userEmailData, mentorEmailData)

  // Send emails to both user and mentor
  await Promise.all([Resendmail(userEmailData), Resendmail(mentorEmailData)]);

  console.log("Meeting emails sent successfully");
});

export const sendReceiptMail = catchAsync(async (mentorship) => {
  const { user, paymentDetails } = mentorship;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    paymentDetails;

  const userEmailData = {
    name: user.name,
    to: user.email,
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    role: "student",
    use: "receipt",
  };

  // Send emails to both user and mentor
  await Promise.all(Resendmail(userEmailData));

  console.log("Receipt emails sent successfully");
});

// export const listEvents = async (req, res) => {
//   try {
//     const response = await calendar.events.list({
//       calendarId: "primary",
//       timeMin: new Date().toISOString(),
//       maxResults: 10,
//       singleEvents: true,
//       orderBy: "startTime",
//     });
//     res.json(response.data.items);
//   } catch (error) {
//     console.error("Error listing events:", error);
//     res.status(500).json({ error: "Failed to fetch events" });
//   }
// };

// export const createMeeting = catchAsync(async (req, res) => {
//   try {
//     const { summary, description, startTime, endTime, attendees } = req.body;

//     const event = {
//       summary,
//       description,
//       start: {
//         dateTime: startTime,
//         timeZone: "UTC",
//       },
//       end: {
//         dateTime: endTime,
//         timeZone: "UTC",
//       },
//       attendees: attendees.map((email) => ({ email })),
//       conferenceData: {
//         createRequest: {
//           requestId: `${Date.now()}`,
//           conferenceSolutionKey: { type: "hangoutsMeet" },
//         },
//       },
//     };

//     const response = await calendar.events.insert({
//       calendarId: "primary",
//       conferenceDataVersion: 1,
//       resource: event,
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error("Error creating meeting:", error);
//     res.status(500).json({ error: "Failed to create meeting" });
//   }
// });
