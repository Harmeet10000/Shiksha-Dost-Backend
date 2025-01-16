import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";


const sesClient = new SESClient({
  region: process.env.SES_REGION,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY,
    secretAccessKey: process.env.SES_SECRET_KEY,
  },
});

export const sendEmail = catchAsync(async (to, subject, body) => {
  if (!to || !subject || !body) {
    throw new AppError(
      "Email, subject, and body are required for sending an email.",
      400
    );
  }

  const params = {
    Source: process.env.MAIL_SENDER_DEFAULT,
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: {
        Data: subject,
      },
      Body: {
        Text: {
          Data: body,
        },
      },
    },
  };

  try {
    const command = new SendEmailCommand(params);
    const result = await sesClient.send(command);
    console.log("Email sent", result);
    return result; // Return the SES response
  } catch (error) {
    console.log("Email not sent", error);
    throw new AppError(`Failed to send email: ${error.message}`, 500);
  }
});
