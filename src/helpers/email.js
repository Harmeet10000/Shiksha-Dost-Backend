import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses";
import { welcomeTemplate } from "../config/welcome-template.js";
import { verificationTemplate } from "../config/verification-template.js";
import { Resend } from "resend";

const sesClient = new SESClient({
  region: process.env.SES_REGION,
  credentials: {
    accessKeyId: process.env.SES_ACCESS_KEY,
    secretAccessKey: process.env.SES_SECRET_KEY,
  },
});

export const Resendmail = catchAsync(async (name, to, verificationURL) => {
  const resend = new Resend("re_dPQCac4W_8N4GP3V3eGJE4trqEZsLnt3Q");

  // console.log("Resend", to, verificationURL);
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { padding: 20px; max-width: 600px; margin: 0 auto; }
        .header { color: #2c5282; }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #2c5282;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer { margin-top: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="header">Verify Your Email Address</h1>
        <p>Hello ${name},</p>
        
        <p>Thank you for creating an account with ShikshaDost. To complete your registration and access all features, please verify your email address.</p>
        
        <p><a href="${verificationURL}" class="button">Verify Email Address</a></p>
        
        <p><small>Or copy and paste this link in your browser:<br>
        ${verificationURL}</small></p>
        
        <p><em>This link will expire in 24 hours for security reasons.</em></p>
        
        <p>If you didn't create an account with ShikshaDost, please ignore this email.</p>
        
        <div class="footer">
            <p>Best regards,<br>
            Team ShikshaDost</p>
        </div>
    </div>
</body>
</html>
`;

  const message = `Please verify your email by clicking on the following link: ${verificationURL}`;

  try {
    const ans = await resend.emails.send({
      from: "contact@shikshadost.com",
      to: to, // Use the 'to' parameter passed to the function
      subject: "Verify Your Email Address",
      html: htmlContent,
    });

    console.log("Verification email sent successfully!", ans);
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw new Error("Failed to send verification email");
  }
});

// Function to send welcome email
export const sendWelcomeEmail = catchAsync(async (recipientEmail, name) => {
  const params = {
    Source: "contact@shikshadost.com",
    Destination: {
      ToAddresses: [recipientEmail],
    },
    Template: "ShikshaDostWelcome",
    TemplateData: JSON.stringify({
      name: name,
      email: recipientEmail,
    }),
  };

  try {
    const command = new SendTemplatedEmailCommand(params);
    await sesClient.send(command);
    return { status: "success", message: "Welcome email sent successfully" };
  } catch (error) {
    throw new AppError("Failed to send welcome email", 500);
  }
});

// Function to send verification email
export const sendVerificationEmail = catchAsync(
  async (recipientEmail, name, verificationLink) => {
    const params = {
      Source: "contact@shikshadost.com",
      Destination: {
        ToAddresses: [recipientEmail],
      },
      Template: "ShikshaDostVerification",
      TemplateData: JSON.stringify({
        name: name,
        verificationLink: verificationLink,
      }),
    };

    try {
      const command = new SendTemplatedEmailCommand(params);
      await sesClient.send(command);
      return {
        status: "success",
        message: "Verification email sent successfully",
      };
    } catch (error) {
      throw new AppError("Failed to send verification email", 500);
    }
  }
);

// Create email templates
export const createEmailTemplates = catchAsync(async () => {
  try {
    // Create both templates
    const createWelcomeTemplate = new CreateTemplateCommand({
      Template: welcomeTemplate,
    });
    const createVerificationTemplate = new CreateTemplateCommand({
      Template: verificationTemplate,
    });

    await sesClient.send(createWelcomeTemplate);
    await sesClient.send(createVerificationTemplate);

    return {
      status: "success",
      message: "Email templates created successfully",
    };
  } catch (error) {
    throw new AppError("Failed to create email templates", 500);
  }
});
