import "./config/dotenvConfig.js";
import connectDB from "./db/connect.js";
import app from "./app.js";

connectDB()
  .then(() => {
    // eslint-disable-next-line no-undef
    const server = app.listen(process.env.PORT || 8000, () => {
      // eslint-disable-next-line no-undef
      console.log(`Server is running at port: ${process.env.PORT}, in ${process.env.NODE_ENV}`);
    });

    // eslint-disable-next-line no-undef
    process.on("unhandledRejection", (err) => {
      console.log("UNHANDLED REJECTION! 💥 Shutting down...");
      console.log(err.name, err.message);
      server.close(() => {
        // eslint-disable-next-line no-undef
        process.exit(1);
      });
    });
    
    // eslint-disable-next-line no-undef
    process.on("SIGTERM", () => {
      console.log("SIGTERM received. Shutting down gracefully...");
      server.close(() => {
        console.log("Process terminated!");
      });
    });
  })
  .catch((err) => {
    console.log("Database Connection Failed! ", err);
  });
