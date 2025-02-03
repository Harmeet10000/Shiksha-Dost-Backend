import { createLogger, format, transports } from "winston";

const { combine, timestamp, printf, errors } = format;

const customFormat = printf(({ level, message, timestamp, stack }) => {
  return stack
    ? `${timestamp} - ${level}: ${message}\nStack: ${stack}\n`
    : `${timestamp} - ${level}: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    errors({ stack: true }), // Captures stack trace
    customFormat
  ),
  transports: [
    new transports.Console(), // Logs to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Logs only errors
    new transports.File({ filename: "logs/combined.log" }), // Logs everything
  ],
});

export default logger;
