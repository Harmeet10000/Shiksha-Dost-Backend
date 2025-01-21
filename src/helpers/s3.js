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

export const uploadToS3 = catchAsync(async (file, destination) => {
  const s3Client = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });
  const uploadParams = {
    Bucket: process.env.BUCKET_NAME,
    Key: `${destination}/${file.originalname}`,
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
      Key: `material/${fileName}`,
    };

    getSignedUrl(s3Client, new GetObjectCommand(getObjectParams))
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

export const getUploadS3URL = catchAsync(async (req, res, next) => {
  const { filename, contentType, destination } = req.body;

  if (!filename || !contentType) {
    return next(new AppError("Filename and ContentType are required", 400));
  }

  const s3Client = new S3Client({
    region: process.env.BUCKET_REGION,
    credentials: {
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    },
  });

  const path = `${destination}/${Date.now()}-${filename}`;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: path,
    ContentType: contentType,
  };

  const signedUrl = await getSignedUrl(
    s3Client,
    new PutObjectCommand(params),
    { expiresIn: 60 * 15 } // URL valid for 5 minutes
  );

  res.status(200).json({
    status: "success",
    signedUrl,
    path,
  });
});
