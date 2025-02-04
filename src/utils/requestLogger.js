import logger from "./logger.js";
const requestLogger = (req, res, next) => {
  const start = Date.now(); // Capture request start time
  res.on("finish", () => {
    const duration = Date.now() - start; // Calculate response time
    const logMessage = `📡 ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | Time: ${duration}ms | IP: ${req.ip} | User-Agent: ${req.headers["user-agent"]}`;
    if (res.statusCode >= 500) {
      logger.error(logMessage); // Log errors
    } else if (res.statusCode >= 400) {
      logger.warn(logMessage); // Log warnings
    } else {
      logger.info(logMessage); // Log successful requests
    }
  });
  next();
};
export default requestLogger;