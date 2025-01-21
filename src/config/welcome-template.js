// {
//     "Template": {
//         "TemplateName": "ShikshaDostWelcome",
//         "SubjectPart": "Welcome to ShikshaDost, {{name}}!",
//         "TextPart": "Dear {{name}},\r\n\r\nWelcome to ShikshaDost! We're excited to have you join our educational journey.\r\n\r\nYour account has been successfully created with the following details:\r\nEmail: {{email}}\r\n\r\nTo ensure the security of your account, please verify your email address by clicking the verification link sent in a separate email.\r\n\r\nIf you have any questions or need assistance, feel free to reach out to our support team.\r\n\r\nBest regards,\r\nTeam ShikshaDost",
//         "HtmlPart": "<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6}.container{padding:20px;max-width:600px;margin:0 auto}.header{color:#2c5282}.footer{margin-top:20px;color:#666}</style></head><body><div class='container'><h1 class='header'>Welcome to ShikshaDost!</h1><p>Dear {{name}},</p><p>We're excited to have you join our educational journey.</p><p><strong>Your account details:</strong><br>Email: {{email}}</p><p>To ensure the security of your account, please verify your email address by clicking the verification link sent in a separate email.</p><p>If you have any questions or need assistance, feel free to reach out to our support team.</p><div class='footer'><p>Best regards,<br>Team ShikshaDost</p></div></div></body></html>"
//     }
// }
// Welcome Email Template
export const welcomeTemplate = {
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
