import mongoose from "mongoose";

const connectDB = async () => {
  try {
    // eslint-disable-next-line no-undef
    const connectionInstance = await mongoose.connect(process.env.DATABASE);
    console.log(
      `\nDatabase connection successful!\nDB HOST: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log("Database connection failed\n", error);
    // eslint-disable-next-line no-undef
    process.exit(1);
  }
};

export default connectDB;
