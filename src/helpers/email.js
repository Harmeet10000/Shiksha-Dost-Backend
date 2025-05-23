/* eslint-disable no-unused-vars */
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import {
  CreateTemplateCommand,
  SESClient,
  SendTemplatedEmailCommand,
} from "@aws-sdk/client-ses";
import { welcomeTemplate } from "../template/welcome-template.js";
import { verificationTemplate } from "../template/verification-template.js";
import { Resend } from "resend";

const sesClient = new SESClient({
  // eslint-disable-next-line no-undef
  region: process.env.SES_REGION,
  credentials: {
    // eslint-disable-next-line no-undef
    accessKeyId: process.env.SES_ACCESS_KEY,
    // eslint-disable-next-line no-undef
    secretAccessKey: process.env.SES_SECRET_KEY,
  },
});

export const Resendmail = catchAsync(async (info) => {
  const {
    name = "",
    to = "",
    verificationURL = "",
    role = "",
    password = "",
    use = "",
    schedule = {},
    meetingLink = "",
    razorpay_order_id = "",
    razorpay_payment_id = "",
    razorpay_signature = "",
  } = info || {};
  console.log(info);
  const resend = new Resend("re_dPQCac4W_8N4GP3V3eGJE4trqEZsLnt3Q");

  let htmlContent = "";
  let subject = "";

  if (role === "mentor" && use === "signup") {
    // Mentor case
    htmlContent = `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
        }
        .container {
            padding: 20px;
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            color: #2c5282;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #2c5282;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 20px;
            color: #666;
        }
    </style>
</head>
<body>
    <div class='container'>
        <h1 class='header'>Welcome to ShikshaDost!</h1>
        <p>Hello ${name},</p>
        <p>Welcome to ShikshaDost! We are thrilled to have you join us as a mentor. Your expertise and guidance will make a meaningful impact on our community.</p>
        <p><strong>Your Login Details:</strong></p>
        <p>Email: ${to}<br>Password: ${password}</p>
        <p><a href='http://localhost:5173/register' class='button'>Login to Your Account</a></p>
        <p><small>Or copy and paste this link in your browser:<br>http://localhost:5173/register</small></p>
        <p>If you have any questions or need assistance, feel free to reach out to us.</p>
        <div class='footer'>
            <p>Best regards,<br>Team ShikshaDost</p>
        </div>
    </div>
</body>
</html>`;
    subject = "Welcome to the ShikshaDost Platform!";
  } else if (role === "mentor" && use === "meeting") {
    // Mentor meeting details email template
    subject = "Meeting Details from ShikshaDost";
    htmlContent = `
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
        <h1 class="header">Meeting Details</h1>
        <p>Hello ${name},</p>
        <p>Your meeting with your student is scheduled on ${new Date(
          schedule.on
        ).toLocaleDateString()} at ${schedule.start} to ${schedule.end}.</p>
        <p><strong>Meeting Link:</strong> <a href="${meetingLink}" target="_blank">${meetingLink}</a></p>
        <p>We look forward to your session!</p>
        <div class="footer">
          <p>Best regards,<br>Team ShikshaDost</p>
        </div>
      </div>
    </body>
    </html>`;
  } else if (role === "student" && use === "meeting") {
    // User meeting details email template
    subject = "Meeting Details from ShikshaDost";
    htmlContent = `
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
    <h1 class="header">Meeting Details</h1>
    <p>Hello ${info.name},</p>
    <p>Your meeting with your student is scheduled on ${new Date(
      info.schedule.on
    ).toLocaleDateString()} at ${info.schedule.start} to ${
      info.schedule.end
    }.</p>
    <p><strong>Meeting Link:</strong> <a href="${
      info.meetingLink
    }" target="_blank">${info.meetingLink}</a></p>
    <p>We look forward to your session!</p>
    
    <h2>Payment Details</h2>
    <p><strong>Order ID:</strong> ${info.razorpay_order_id}</p>
    <p><strong>Payment ID:</strong> ${info.razorpay_payment_id}</p>
    <p><strong>Signature:</strong> ${info.razorpay_signature}</p>

    <div class="footer">
      <p>Best regards,<br>Team ShikshaDost</p>
    </div>
  </div>
</body>
</html>`;
  } else if (role === "student" && use === "signup") {
    // Student case
    htmlContent = `
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
</html>`;
    subject = "Verify Your Email Address";
  }
  try {
    const ans = await resend.emails.send({
      from: "contact@shikshadost.com",
      to: to,
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully!", ans);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
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
