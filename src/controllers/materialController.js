import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Material } from "../models/materialModel.js";
import { uploadToS3 } from "../helpers/s3.js";

export const uploadFile = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError("No file uploaded.", 400));
  }

  await uploadToS3(file, material);

  const newMaterial = await Material.create({
    category: req.body.category,
    class: req.body.class,
    subject: req.body.subject,
    chapter: req.body.chapter,
    topicName: req.body.topicName,
    filename: file.originalname,
  });

  res.status(200).send({
    message: "File uploaded successfully",
    data: newMaterial,
  });
});
