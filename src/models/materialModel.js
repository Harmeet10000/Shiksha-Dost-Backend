import mongoose from "mongoose";
const { Schema } = mongoose;

const materialSchema = new Schema({
  category: {
    type: String,
    required: [true, "A material must have a category"],
  },
  class: {
    type: String,
    required: [true, "A material must have a class"],
  },
  subject: {
    type: String,
    required: [true, "A material must have a subject"],
  },
  chapter: {
    type: String,
    required: [true, "A material must have a chapter"],
  },
  topicName: {
    type: String,
    required: [true, "A material must have a topic name"],
  },
  year: {
    type: Number,
    required: [true, "A material must have a year"],
  },
  s3URL: {
    type: String,
    required: [true, "A material must have an S3 URL"],
  },
});

export const Material = mongoose.model("Material", materialSchema);
