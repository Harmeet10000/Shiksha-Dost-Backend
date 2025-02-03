import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { blockOne, deleteOne, getAll, updateOne } from "./handlerFactory.js";
import { User } from "../models/userModel.js";
import { Mentor } from "../models/mentorModel.js";
import { DPP } from "../models/dppModel.js";
import { Mentorship } from "../models/mentorshipModel.js";

export const blockStudent = blockOne(User);
export const deleteStudent = deleteOne(User);

export const blockMentor = blockOne(Mentor);
export const deleteMentor = deleteOne(Mentor);

export const updateStudentProfile = updateOne(User);

export const getUserMentorship = getAll(Mentorship);

export const getUserDPPs = getAll(User);
// eslint-disable-next-line no-unused-vars
export const submitDPP = catchAsync(async (req, res, next) => {
  const { userAnswers, durationTaken, startAt, submittedAt, dppId } = req.body;

  const userId = req.user._id;

  const user = await User.findById(userId);

  const dpp = await DPP.findById(dppId);

  let questionsCorrect = 0;
  let questionsIncorrect = 0;
  let obtainedMarks = 0;

  userAnswers.forEach((userAnswer) => {
    const problem = dpp.problems.find(
      (problem) => problem._id.toString() === userAnswer.question.toString()
    );

    if (!problem) return;

    const isCorrect = problem.correctOption === userAnswer.answer;

    if (isCorrect) {
      questionsCorrect += 1;
      obtainedMarks += problem.marks;
    } else {
      questionsIncorrect += 1;
    }
  });

  const questionsAttempted = questionsCorrect + questionsIncorrect;
  const questionsUnattempted = dpp.problems.length - questionsAttempted;

  const solvedDPP = {
    dpp: dppId,
    userAnswers,
    durationTaken,
    startAt,
    submittedAt,
    obtainedMarks,
    questionsCorrect,
    questionsIncorrect,
    questionsAttempted,
    questionsUnattempted,
    isCompleted: true,
  };

  user.solvedDPPs.push(solvedDPP);

  await user.save();

  res.status(200).json({
    status: "success",
    message: "DPP successfully submitted",
    data: {
      solvedDPPs: user.solvedDPPs,
    },
  });
});

export const getUserStats = catchAsync(async (req, res, next) => {
  const { period, value } = req.query; // Example: ?period=days&value=20

  if (!period || !value) {
    return next(new AppError("Invalid query parameters", 400));
  }

  const timeUnits = {
    months: { $dateToString: { format: "%b", date: "$createdAt" } }, // Jan, Feb, Mar
    weeks: { $concat: ["Week ", { $toString: { $isoWeek: "$createdAt" } }] }, // Week 1, Week 2
    days: {
      $switch: {
        branches: [
          { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 1] }, then: "Sunday" },
          { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 2] }, then: "Monday" },
          { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 3] }, then: "Tuesday" },
          {
            case: { $eq: [{ $dayOfWeek: "$createdAt" }, 4] },
            then: "Wednesday",
          },
          {
            case: { $eq: [{ $dayOfWeek: "$createdAt" }, 5] },
            then: "Thursday",
          },
          { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 6] }, then: "Friday" },
          {
            case: { $eq: [{ $dayOfWeek: "$createdAt" }, 7] },
            then: "Saturday",
          },
        ],
        default: "Unknown",
      },
    },
  };

  if (!timeUnits[period]) {
    return next(new AppError("Invalid period type", 400));
  }

  const startDate = new Date();
  if (period === "days") {
    startDate.setUTCDate(startDate.getUTCDate() - value);
  } else if (period === "weeks") {
    startDate.setUTCDate(startDate.getUTCDate() - value * 7);
  } else if (period === "months") {
    startDate.setUTCMonth(startDate.getUTCMonth() - value);
  }
  // console.log(startDate);

  const userStats = await User.aggregate([
    { $match: { createdAt: { $gte: startDate }, isVerified: { $ne: false } } },
    { $group: { _id: timeUnits[period], count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  // if (!userStats) {
  //   return next(new AppError("Nothing found", 404));
  // }

  // Formatting response
  const stats = userStats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

export const mentorshipGiven = catchAsync(async (req, res, next) => {
  const { period, value, status } = req.query;

  // Validate query parameters
  if (!period || !value || !status) {
    return next(new AppError("Invalid query parameters", 400));
  }

  // Valid statuses
  const validStatuses = [
    "Pending",
    "Scheduled",
    "In Progress",
    "Completed",
    "Cancelled",
  ];
  if (!validStatuses.includes(status)) {
    return next(new AppError("Invalid status value", 400));
  }

  // Grouping logic based on period
  const timeUnits = {
    months: { $dateToString: { format: "%b", date: "$createdAt" } }, // e.g., Jan, Feb
    weeks: { $concat: ["Week ", { $toString: { $isoWeek: "$createdAt" } }] }, // e.g., Week 1
    days: {
      $switch: {
        branches: [
          { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 1] }, then: "Sunday" },
          { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 2] }, then: "Monday" },
          { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 3] }, then: "Tuesday" },
          {
            case: { $eq: [{ $dayOfWeek: "$createdAt" }, 4] },
            then: "Wednesday",
          },
          {
            case: { $eq: [{ $dayOfWeek: "$createdAt" }, 5] },
            then: "Thursday",
          },
          { case: { $eq: [{ $dayOfWeek: "$createdAt" }, 6] }, then: "Friday" },
          {
            case: { $eq: [{ $dayOfWeek: "$createdAt" }, 7] },
            then: "Saturday",
          },
        ],
        default: "Unknown",
      },
    },
  };

  if (!timeUnits[period]) {
    return next(new AppError("Invalid period type", 400));
  }

  // Calculate start date based on the given period
  const startDate = new Date();
  if (period === "days") startDate.setUTCDate(startDate.getUTCDate() - value);
  if (period === "weeks")
    startDate.setUTCDate(startDate.getUTCDate() - value * 7);
  if (period === "months")
    startDate.setUTCMonth(startDate.getUTCMonth() - value);

  const mentorshipStats = await Mentorship.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        isPaid: true,
        status: status,
      },
    },
    { $group: { _id: timeUnits[period], count: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);
  // console.log(mentorshipStats);

  // if (!mentorshipStats) {
  //   return next(new AppError("Nothing found", 404));
  // }
  
  // Formatting response
  const stats = mentorshipStats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});

  res.status(200).json({
    status: "success",
    data: stats,
  });
});

