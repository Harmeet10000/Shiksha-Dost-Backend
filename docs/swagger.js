import swaggerAutogen from "swagger-autogen";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputFile = path.join(__dirname, "./swagger-output.json");
const endpointsFiles = [
  path.join(__dirname, "../src/routes/authRoutes.js"),
  path.join(__dirname, "../src/routes/userRoutes.js"),
  path.join(__dirname, "../src/routes/mentorRoutes.js"),
  path.join(__dirname, "../src/routes/blogRoutes.js"),
  path.join(__dirname, "../src/routes/commentRoutes.js"),
  path.join(__dirname, "../src/routes/materialRoutes.js"),
  path.join(__dirname, "../src/routes/mentorshipRoutes.js"),
  path.join(__dirname, "../src/routes/dppRoutes.js"),
  path.join(__dirname, "../src/routes/paymentRoutes.js"),
];

const doc = {
  info: {
    title: "Shiksha Dost API",
    description: "API documentation for Shiksha Dost Backend",
    version: "1.0.0",
    contact: {
      name: "API Support",
      email: "support@example.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: "http://localhost:8000/api/v1",
      description: "Development server",
    },
    {
      url: "https://api.shikshadost.com/api/v1",
      description: "Production server",
    },
  ],
  basePath: "/api/v1",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  tags: [
    { name: "Authentication", description: "Authentication endpoints" },
    { name: "Users", description: "User operations" },
    { name: "Mentors", description: "Mentor operations" },
    { name: "Blogs", description: "Blog operations" },
    { name: "Comments", description: "Comment operations" },
    { name: "Materials", description: "Study materials operations" },
    { name: "Mentorship", description: "Mentorship operations" },
    { name: "DPP", description: "Daily Practice Problem operations" },
    { name: "Payments", description: "Payment operations" },
  ],
  securityDefinitions: {
    bearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
    cookieAuth: {
      type: "apiKey",
      in: "cookie",
      name: "jwt",
    },
    csrfToken: {
      type: "apiKey",
      in: "header",
      name: "X-XSRF-TOKEN",
    },
  },
  definitions: {
    // User Model
    User: {
      type: "object",
      properties: {
        _id: { type: "string", example: "60d0fe4f5311236168a109ca" },
        name: { type: "string", example: "John Doe" },
        email: { type: "string", example: "john@example.com" },
        password: { type: "string", example: "hashedpassword123" },
        photo: { type: "string", example: "default.jpg" },
        role: { type: "string", example: "user", enum: ["user", "admin"] },
        isVerified: { type: "boolean", example: true },
        isActive: { type: "boolean", example: true },
        passwordChangedAt: { type: "string", format: "date-time" },
        passwordResetToken: { type: "string" },
        passwordResetExpires: { type: "string", format: "date-time" },
        emailVerificationToken: { type: "string" },
        emailVerificationExpires: { type: "string", format: "date-time" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00.000Z",
        },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["name", "email", "password"],
    },

    // Mentor Model
    Mentor: {
      type: "object",
      properties: {
        _id: { type: "string", example: "60d0fe4f5311236168a109cb" },
        name: { type: "string", example: "Jane Smith" },
        email: { type: "string", example: "jane@example.com" },
        password: { type: "string", example: "hashedpassword123" },
        photo: { type: "string", example: "default.jpg" },
        role: { type: "string", example: "mentor", default: "mentor" },
        expertise: {
          type: "array",
          items: { type: "string" },
          example: ["Mathematics", "Physics"],
        },
        qualifications: {
          type: "array",
          items: { type: "string" },
          example: ["PhD in Mathematics", "M.Sc in Physics"],
        },
        experience: { type: "number", example: 5 },
        bio: {
          type: "string",
          example:
            "Experienced educator with a passion for teaching mathematics.",
        },
        availability: {
          type: "object",
          properties: {
            days: {
              type: "array",
              items: { type: "string" },
              example: ["Monday", "Wednesday", "Friday"],
            },
            times: {
              type: "array",
              items: { type: "string" },
              example: ["10:00-12:00", "15:00-17:00"],
            },
          },
        },
        rating: { type: "number", example: 4.8 },
        isVerified: { type: "boolean", example: true },
        isActive: { type: "boolean", example: true },
        passwordChangedAt: { type: "string", format: "date-time" },
        passwordResetToken: { type: "string" },
        passwordResetExpires: { type: "string", format: "date-time" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00.000Z",
        },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["name", "email", "password"],
    },

    // Blog Model
    Blog: {
      type: "object",
      properties: {
        _id: { type: "string", example: "60d0fe4f5311236168a109cc" },
        title: {
          type: "string",
          example: "Understanding Calculus Fundamentals",
        },
        content: {
          type: "string",
          example: "Calculus is the mathematical study of continuous change...",
        },
        author: { type: "string", example: "60d0fe4f5311236168a109ca" },
        authorType: {
          type: "string",
          example: "user",
          enum: ["user", "mentor", "admin"],
        },
        category: { type: "string", example: "Mathematics" },
        tags: {
          type: "array",
          items: { type: "string" },
          example: ["calculus", "mathematics", "education"],
        },
        featuredImage: { type: "string", example: "calculus-image.jpg" },
        isPublished: { type: "boolean", example: true },
        publishDate: { type: "string", format: "date-time" },
        views: { type: "number", example: 1250 },
        likes: { type: "number", example: 45 },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00.000Z",
        },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["title", "content", "author", "authorType"],
    },

    // Comment Model
    Comment: {
      type: "object",
      properties: {
        _id: { type: "string", example: "60d0fe4f5311236168a109cd" },
        content: {
          type: "string",
          example: "This blog was really helpful for understanding the basics!",
        },
        user: { type: "string", example: "60d0fe4f5311236168a109ca" },
        userType: {
          type: "string",
          example: "user",
          enum: ["user", "mentor", "admin"],
        },
        blog: { type: "string", example: "60d0fe4f5311236168a109cc" },
        parentComment: { type: "string", example: "60d0fe4f5311236168a109ce" },
        isEdited: { type: "boolean", example: false },
        likes: { type: "number", example: 5 },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00.000Z",
        },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["content", "user", "userType", "blog"],
    },

    // Like Model
    Like: {
      type: "object",
      properties: {
        _id: { type: "string", example: "60d0fe4f5311236168a109cf" },
        user: { type: "string", example: "60d0fe4f5311236168a109ca" },
        userType: {
          type: "string",
          example: "user",
          enum: ["user", "mentor", "admin"],
        },
        contentType: {
          type: "string",
          example: "blog",
          enum: ["blog", "comment"],
        },
        contentId: { type: "string", example: "60d0fe4f5311236168a109cc" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00.000Z",
        },
      },
      required: ["user", "userType", "contentType", "contentId"],
    },

    // Material Model
    Material: {
      type: "object",
      properties: {
        _id: { type: "string", example: "60d0fe4f5311236168a109d0" },
        title: { type: "string", example: "Complete Calculus Study Guide" },
        description: {
          type: "string",
          example:
            "A comprehensive guide to calculus fundamentals with practice problems.",
        },
        type: {
          type: "string",
          example: "pdf",
          enum: ["pdf", "video", "image", "link"],
        },
        category: { type: "string", example: "Mathematics" },
        subject: { type: "string", example: "Calculus" },
        author: { type: "string", example: "60d0fe4f5311236168a109cb" },
        authorType: {
          type: "string",
          example: "mentor",
          enum: ["mentor", "admin"],
        },
        fileUrl: {
          type: "string",
          example: "https://example.com/calculus-guide.pdf",
        },
        thumbnailUrl: {
          type: "string",
          example: "https://example.com/calculus-thumbnail.jpg",
        },
        isPremium: { type: "boolean", example: false },
        tags: {
          type: "array",
          items: { type: "string" },
          example: ["calculus", "mathematics", "study guide"],
        },
        downloads: { type: "number", example: 350 },
        views: { type: "number", example: 1200 },
        rating: { type: "number", example: 4.7 },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00.000Z",
        },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: [
        "title",
        "description",
        "type",
        "category",
        "author",
        "authorType",
      ],
    },

    // Mentorship Model
    Mentorship: {
      type: "object",
      properties: {
        _id: { type: "string", example: "60d0fe4f5311236168a109d1" },
        mentor: { type: "string", example: "60d0fe4f5311236168a109cb" },
        mentee: { type: "string", example: "60d0fe4f5311236168a109ca" },
        subject: { type: "string", example: "Mathematics" },
        topic: { type: "string", example: "Calculus" },
        status: {
          type: "string",
          example: "active",
          enum: ["pending", "active", "completed", "cancelled"],
        },
        startDate: { type: "string", format: "date-time" },
        endDate: { type: "string", format: "date-time" },
        sessions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              date: { type: "string", format: "date-time" },
              duration: { type: "number", example: 60 }, // minutes
              notes: {
                type: "string",
                example: "Covered integral calculus basics",
              },
              status: {
                type: "string",
                example: "completed",
                enum: ["scheduled", "completed", "cancelled"],
              },
              meetingLink: {
                type: "string",
                example: "https://meet.google.com/abc-defg-hij",
              },
            },
          },
        },
        feedback: {
          type: "object",
          properties: {
            rating: { type: "number", example: 5 },
            comment: {
              type: "string",
              example:
                "The mentorship was very helpful and the mentor was knowledgeable.",
            },
          },
        },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00.000Z",
        },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["mentor", "mentee", "subject"],
    },

    // DPP (Daily Practice Problem) Model
    DPP: {
      type: "object",
      properties: {
        _id: { type: "string", example: "60d0fe4f5311236168a109d2" },
        title: { type: "string", example: "Day 1: Calculus Fundamentals" },
        description: {
          type: "string",
          example: "Practice problems on limits and derivatives.",
        },
        subject: { type: "string", example: "Mathematics" },
        topic: { type: "string", example: "Calculus" },
        difficulty: {
          type: "string",
          example: "medium",
          enum: ["easy", "medium", "hard"],
        },
        author: { type: "string", example: "60d0fe4f5311236168a109cb" },
        authorType: {
          type: "string",
          example: "mentor",
          enum: ["mentor", "admin"],
        },
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              questionText: {
                type: "string",
                example: "Find the derivative of f(x) = x²+3x+2",
              },
              options: {
                type: "array",
                items: { type: "string" },
                example: ["2x+3", "x²+3", "x+3", "2x"],
              },
              correctOption: { type: "number", example: 0 },
              explanation: {
                type: "string",
                example:
                  "The derivative of x² is 2x, and the derivative of 3x is 3, so the answer is 2x+3.",
              },
            },
          },
        },
        isPublished: { type: "boolean", example: true },
        publishDate: { type: "string", format: "date-time" },
        expiryDate: { type: "string", format: "date-time" },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00.000Z",
        },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["title", "subject", "author", "authorType", "questions"],
    },

    // Payment Object (assumed for payment routes)
    Payment: {
      type: "object",
      properties: {
        _id: { type: "string", example: "60d0fe4f5311236168a109d3" },
        user: { type: "string", example: "60d0fe4f5311236168a109ca" },
        amount: { type: "number", example: 1999 },
        currency: { type: "string", example: "INR" },
        status: {
          type: "string",
          example: "completed",
          enum: ["pending", "completed", "failed", "refunded"],
        },
        paymentMethod: { type: "string", example: "razorpay" },
        paymentId: { type: "string", example: "pay_LRcf5HKhvI5sC8" },
        orderId: { type: "string", example: "order_LRcejeiI6th5Bf" },
        receipt: { type: "string", example: "receipt_123456" },
        subscriptionId: { type: "string", example: "sub_LRcf5NOlGwYROB" },
        product: {
          type: "object",
          properties: {
            type: {
              type: "string",
              example: "mentorship",
              enum: ["mentorship", "material", "subscription"],
            },
            id: { type: "string", example: "60d0fe4f5311236168a109d1" },
          },
        },
        createdAt: {
          type: "string",
          format: "date-time",
          example: "2023-01-01T00:00:00.000Z",
        },
        updatedAt: { type: "string", format: "date-time" },
      },
      required: ["user", "amount", "currency", "status", "paymentMethod"],
    },
  },
};

swaggerAutogen()(outputFile, endpointsFiles, doc);

// // Generate swagger.json
// const generateSwagger = async () => {
//   try {
//     await swaggerAutogen()(outputFile, endpointsFiles, doc);
//     console.log("Swagger documentation generated successfully");
//   } catch (error) {
//     console.error("Error generating Swagger documentation:", error);
//   }
// };

// export default generateSwagger;
 