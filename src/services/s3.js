import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";



// Configure S3 client
const s3Client = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCESS_KEY,
  },
});
// console.log(
//   "Config Variables: ",
//   BUCKET_REGION,
//   ACCESS_KEY,
//   SECRET_ACCESS_KEY
// );

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
    console.log("Upload Success", data);
    return data;
  } catch (err) {
    console.log("Error", err);
    throw new AppError("Error uploading file to S3", 500);
  }
});
