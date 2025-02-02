// {
//     "Template": {
//         "TemplateName": "ShikshaDostVerification",
//         "SubjectPart": "Verify Your ShikshaDost Email Address",
//         "TextPart": "Hello {{name}},\r\n\r\nThank you for creating an account with ShikshaDost. To complete your registration and access all features, please verify your email address.\r\n\r\nClick the following link to verify your email:\r\n{{verificationLink}}\r\n\r\nThis link will expire in 24 hours for security reasons.\r\n\r\nIf you didn't create an account with ShikshaDost, please ignore this email.\r\n\r\nBest regards,\r\nTeam ShikshaDost",
//         "HtmlPart": "<!DOCTYPE html><html><head><style>body{font-family:Arial,sans-serif;line-height:1.6}.container{padding:20px;max-width:600px;margin:0 auto}.header{color:#2c5282}.button{display:inline-block;padding:10px 20px;background-color:#2c5282;color:white;text-decoration:none;border-radius:5px;margin:20px 0}.footer{margin-top:20px;color:#666}</style></head><body><div class='container'><h1 class='header'>Verify Your Email Address</h1><p>Hello {{name}},</p><p>Thank you for creating an account with ShikshaDost. To complete your registration and access all features, please verify your email address.</p><p><a href='{{verificationLink}}' class='button'>Verify Email Address</a></p><p><small>Or copy and paste this link in your browser:<br>{{verificationLink}}</small></p><p><em>This link will expire in 24 hours for security reasons.</em></p><p>If you didn't create an account with ShikshaDost, please ignore this email.</p><div class='footer'><p>Best regards,<br>Team ShikshaDost</p></div></div></body></html>"
//     }
// }

// Verification Email Template
export const verificationTemplate = {
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
