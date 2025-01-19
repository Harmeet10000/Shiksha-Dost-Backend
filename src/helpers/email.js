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

// Create email templates
export const createEmailTemplates = catchAsync(async () => {
  // Welcome Email Template
  const welcomeTemplate = {
    TemplateName: "ShikshaDostWelcome",
    SubjectPart: "Welcome to ShikshaDost, {{name}}!",
    TextPart: `
Dear {{name}},

Welcome to ShikshaDost! We're excited to have you join our educational journey.

Your account has been successfully created with the following details:
Email: {{email}}

To ensure the security of your account, please verify your email address by clicking the verification link sent in a separate email.

If you have any questions or need assistance, feel free to reach out to our support team.

Best regards,
Team ShikshaDost
        `,
    HtmlPart: `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { padding: 20px; max-width: 600px; margin: 0 auto; }
        .header { color: #2c5282; }
        .footer { margin-top: 20px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <h1 class="header">Welcome to ShikshaDost!</h1>
        <p>Dear {{name}},</p>
        
        <p>We're excited to have you join our educational journey.</p>
        
        <p><strong>Your account details:</strong><br>
        Email: {{email}}</p>
        
        <p>To ensure the security of your account, please verify your email address by clicking the verification link sent in a separate email.</p>
        
        <p>If you have any questions or need assistance, feel free to reach out to our support team.</p>
        
        <div class="footer">
            <p>Best regards,<br>
            Team ShikshaDost</p>
        </div>
    </div>
</body>
</html>
        `,
  };

  // Verification Email Template
  const verificationTemplate = {
    TemplateName: "ShikshaDostVerification",
    SubjectPart: "Verify Your ShikshaDost Email Address",
    TextPart: `
Hello {{name}},

Thank you for creating an account with ShikshaDost. To complete your registration and access all features, please verify your email address.

Click the following link to verify your email:
{{verificationLink}}

This link will expire in 24 hours for security reasons.

If you didn't create an account with ShikshaDost, please ignore this email.

Best regards,
Team ShikshaDost
        `,
    HtmlPart: `
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
        <p>Hello {{name}},</p>
        
        <p>Thank you for creating an account with ShikshaDost. To complete your registration and access all features, please verify your email address.</p>
        
        <p><a href="{{verificationLink}}" class="button">Verify Email Address</a></p>
        
        <p><small>Or copy and paste this link in your browser:<br>
        {{verificationLink}}</small></p>
        
        <p><em>This link will expire in 24 hours for security reasons.</em></p>
        
        <p>If you didn't create an account with ShikshaDost, please ignore this email.</p>
        
        <div class="footer">
            <p>Best regards,<br>
            Team ShikshaDost</p>
        </div>
    </div>
</body>
</html>
        `,
  };

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
