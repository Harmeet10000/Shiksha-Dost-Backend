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
    default: new Date().getFullYear(),
  },
  S3url: {
    type: String,
    required: [true, "A material must have a S3url"],
  },
});

export const Material = mongoose.model("Material", materialSchema);
