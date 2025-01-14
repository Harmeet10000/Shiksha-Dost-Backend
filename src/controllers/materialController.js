import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import multer from "multer";
import { Material } from "../models/materialModel.js";
import { uploadToS3 } from "../services/s3.js";

// Configure multer for file uploads
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });


export const uploadFile = catchAsync(async (req, res, next) => {
  const file = req.file;
  if (!file) {
    return next(new AppError("No file uploaded.", 400));
  }

  const result = await uploadToS3(file);
  console.log("result", result);
  const s3URL = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${file.originalname}`;

  const newMaterial = await Material.create({
    category: req.body.category,
    class: req.body.class,
    subject: req.body.subject,
    chapter: req.body.chapter,
    topicName: req.body.topicName,
    year: req.body.year,
    s3URL: s3URL,
  });

  res.status(200).send({
    message: "File uploaded successfully",
    data: newMaterial,
  });
});
