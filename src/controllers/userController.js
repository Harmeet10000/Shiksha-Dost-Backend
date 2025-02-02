import catchAsync from "../utils/catchAsync.js";
import { User } from "../models/userModel.js";
import { blockOne, deleteOne, getAll, updateOne } from "./handlerFactory.js";
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


// export const getUserStats = catchAsync(async (req, res, next) => {
//   const result = await User.aggregate([{ $count: "totalUsers" }]);
//   res.status(200).json({ result });
// });

// export const getUser = getOne(User, { path: "bookings" });

// // Do NOT update passwords with this!
// export const updateUser = updateOne(User);
