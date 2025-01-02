import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import multer from "multer";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Material } from "../models/materialModel.js";

// Configure multer for file uploads
const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });


// Configure S3 client
const s3Client = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});
// console.log("Config Variables: ", BUCKET_REGION, ACCESS_KEY, SECRET_ACCESS_KEY);

// Upload file to S3
const uploadToS3 = async (file) => {
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("Upload Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
    throw new AppError("Error uploading file to S3", 500);
  }
};

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
