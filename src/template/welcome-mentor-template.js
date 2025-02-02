// {
//     "Template": {
//         "TemplateName": "ShikshaDostMentorWelcome",
//         "SubjectPart": "Welcome to the ShikshaDost Platform!",
//         "TextPart": "Hello {{name}},\r\n\r\nWelcome to ShikshaDost! We are thrilled to have you join us as a mentor. Your expertise and guidance will make a meaningful impact on our community.\r\n\r\nTo access your account and explore the platform, click the following link:\r\n\r\nLogin: http://localhost:5173/register\r\n\r\nIf you have any questions or need assistance, feel free to reach out to us.\r\n\r\nBest regards,\r\nTeam ShikshaDost",
//         "HtmlPart": "<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6}.container{padding:20px;max-width:600px;margin:0 auto}.header{color:#2c5282}.button{display:inline-block;padding:10px 20px;background-color:#2c5282;color:white;text-decoration:none;border-radius:5px;margin:20px 0}.footer{margin-top:20px;color:#666}</style></head><body><div class='container'><h1 class='header'>Welcome to ShikshaDost!</h1><p>Hello {{name}},</p><p>Welcome to ShikshaDost! We are thrilled to have you join us as a mentor. Your expertise and guidance will make a meaningful impact on our community.</p><p><a href='http://localhost:5173/register' class='button'>Login to Your Account</a></p><p><small>Or copy and paste this link in your browser:<br>http://localhost:5173/register</small></p><p>If you have any questions or need assistance, feel free to reach out to us.</p><div class='footer'><p>Best regards,<br>Team ShikshaDost</p></div></div></body></html>"
//     }
// }

export const mentorWelcomeTemplate = {
  Template: {
    TemplateName: "ShikshaDostMentorWelcome",
    SubjectPart: "Welcome to the ShikshaDost Platform!",
    TextPart: `Hello {{name}},\n\nWelcome to ShikshaDost! We are thrilled to have you join us as a mentor. Your expertise and guidance will make a meaningful impact on our community.\n\nTo access your account and explore the platform, click the following link:\n\nLogin: http://localhost:5173/register\n\nIf you have any questions or need assistance, feel free to reach out to us.\n\nBest regards,\nTeam ShikshaDost`,
    HtmlPart: `<!DOCTYPE html>
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
        <p>Hello {{name}},</p>
        <p>Welcome to ShikshaDost! We are thrilled to have you join us as a mentor. Your expertise and guidance will make a meaningful impact on our community.</p>
        <p><a href='http://localhost:5173/register' class='button'>Login to Your Account</a></p>
        <p><small>Or copy and paste this link in your browser:<br>http://localhost:5173/register</small></p>
        <p>If you have any questions or need assistance, feel free to reach out to us.</p>
        <div class='footer'>
            <p>Best regards,<br>Team ShikshaDost</p>
        </div>
    </div>
</body>
</html>`,
  },
};
