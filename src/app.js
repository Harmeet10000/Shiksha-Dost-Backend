import express from "express";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cors from "cors";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import mentorRoutes from "./routes/mentorRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import dppRoutes from "./routes/dppRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import requestLogger from "./utils/requestLogger.js";

const app = express();

// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers

app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(requestLogger);
}
// Limit requests from same API
const limiter = rateLimit({
  max: 500,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "16kb" }));

// Middleware to handle URL-encoded data
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser()); 

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [

//     ],
//   })
// );

// Test middleware
// app.use((req, res, next) => {
//   req.requestTime = new Date().toISOString();
//   // console.log(req.headers);
//   next();
// });
 
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
    credentials: true,
  })
);

// 3) ROUTES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/mentor", mentorRoutes);
app.use("/api/v1/blogs", blogRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/material", materialRoutes);
app.use("/api/v1/mentorship", mentorshipRoutes);
app.use("/api/v1/dpp", dppRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

const server = app;
export default server;
