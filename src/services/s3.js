import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import multer from "multer";

const BUCKET_NAME = "shikshadost-studymaterial";
const BUCKET_REGION = "ap-south-1";
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

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

// Upload file to S3
export const uploadToS3 = catchAsync(async (file) => {
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    // console.log("Upload Success", data);
  } catch (err) {
    console.log("Error", err);
    throw new AppError("Error uploading file to S3", 500);
  }
});
