import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import multer from "multer";

const storage = multer.memoryStorage();
export const upload = multer({ storage: storage });

export const uploadToS3 = catchAsync(async (file) => {
  const s3Client = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: file.originalname,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    console.log("Upload Success", data);
  } catch (err) {
    console.error("Error", err);
    throw new AppError("Error uploading file to S3", 500);
  }
});

export const getS3URL = (fileName) => {
  return new Promise((resolve, reject) => {
    const s3Client = new S3Client({
      region: process.env.BUCKET_REGION,
      credentials: {
        accessKeyId: process.env.ACCESS_KEY,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
      },
    });

    const getObjectParams = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
    };

    getSignedUrl(s3Client, new GetObjectCommand(getObjectParams), {
      expiresIn: 3600,
    })
      .then((signedUrl) => {
        // console.log("Generated Signed URL:", signedUrl);
        resolve(signedUrl);
      })
      .catch((err) => {
        console.error("Error generating signed URL:", err);
        reject(new AppError("Error generating signed URL", 500));
      });
  });
};
