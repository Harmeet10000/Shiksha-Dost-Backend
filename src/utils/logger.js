import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors, colorize } = format;

// Define custom colors
const logColors = {
  error: "red",
  warn: "yellow",
  info: "cyan",
  http: "magenta",
  debug: "green",
};

// Apply colors to Winston
import winston from "winston";
winston.addColors(logColors);

// Custom log format with colors
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `${timestamp} - ${level}: ${message}\nStack: ${stack}`
    : `${timestamp} - ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    colorize(), // Enable colors
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Captures stack trace
    customFormat
  ),
  transports: [
    new transports.Console(), // Logs to console with colors
    new transports.File({ filename: "logs/error.log", level: "error" }), // Logs only errors
    new transports.File({ filename: "logs/combined.log" }), // Logs everything
  ],
});

export default logger;
