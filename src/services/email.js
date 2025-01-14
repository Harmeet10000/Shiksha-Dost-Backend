import AWS from "aws-sdk";

// Configure AWS SDK
AWS.config.update({ region: "us-east-1" }); // Set your region

const ses = new AWS.SES({ apiVersion: "2010-12-01" });

const sendEmail = async ({ email, subject, message }) => {
  const params = {
    Source: "your-email@example.com", // Verified email in SES
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: "UTF-8",
      },
      Body: {
        Text: {
          Data: message,
          Charset: "UTF-8",
        },
      },
    },
  };

  try {
    await ses.sendEmail(params).promise();
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email", error);
    throw new Error("Error sending email");
  }
};

export default sendEmail;
