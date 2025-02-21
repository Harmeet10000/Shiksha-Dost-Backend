import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { DPP } from "../models/dppModel.js";
import { createOne, deleteOne, getAll, getOne } from "./handlerFactory.js";


export const getAllDPP = getAll(DPP);

export const getDPP = getOne(DPP);

export const createDPP = createOne(DPP);

export const deleteDPP = deleteOne(DPP);

export const updateDPP = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { category, subject, topicName, year, problems, totalMarks } = req.body;

  const updateFields = {};

  if (category) updateFields.category = category;
  if (subject) updateFields.subject = subject;
  if (topicName) updateFields.topicName = topicName;
  if (year) updateFields.year = year;
  if (totalMarks) updateFields.totalMarks = totalMarks;

  // Update specific problems if provided
  if (Array.isArray(problems)) {
    for (const problem of problems) {
      if (!problem._id) {
        return next(
          new AppError(
            "Each problem must include a valid _id for updates.",
            400
          )
        );
      }

      const updateProblemFields = {};

      if (problem.question)
        updateProblemFields["problems.$.question"] = problem.question;
      if (problem.options)
        updateProblemFields["problems.$.options"] = problem.options;
      if (problem.correctOption)
        updateProblemFields["problems.$.correctOption"] = problem.correctOption;
      if (problem.marks !== undefined)
        updateProblemFields["problems.$.marks"] = problem.marks;

      const updatedProblem = await DPP.updateOne(
        { _id: id, "problems._id": problem._id },
        { $set: updateProblemFields }
      );

      if (updatedProblem.matchedCount === 0) {
        return next(
          new AppError(`No problem found with ID: ${problem._id}`, 404)
        );
      }
    }
  }

  // Update the main DPP fields
  const updatedDPP = await DPP.findByIdAndUpdate(
    id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  if (!updatedDPP) {
    return next(new AppError("No DPP found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: updatedDPP,
  });
});
