import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Material } from "../models/materialModel.js";
import { uploadToS3 } from "../services/s3.js";




export const uploadFile = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError("No file uploaded.", 400));
  }

  await uploadToS3(file);
  const BUCKET_NAME = "shikshadost-studymaterial";
  const BUCKET_REGION = "ap-south-1";
  const s3URL = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${file.originalname}`;
  // console.log("s3URL", s3URL);

  const newMaterial = await Material.create({
    category: req.body.category,
    class: req.body.class,
    subject: req.body.subject,
    chapter: req.body.chapter,
    topicName: req.body.topicName,
    s3URL: s3URL,
  });

  res.status(200).send({
    message: "File uploaded successfully",
    data: newMaterial,
  });
});
