import mongoose from "mongoose";
const { Schema } = mongoose;

const dppSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    category: {
      type: String,
      required: [true, "A DPP must have a category"],
    },
    subject: {
      type: String,
      required: [true, "A DPP must have a subject"],
    },
    topicName: {
      type: String,
      required: [true, "A DPP must have a topic name"],
    },
    year: {
      type: Date,
      required: [true, "A DPP must have a year"],
    },
    duration: {
      type: Number,
    },
    problems: [
      {
        question: {
          text: { type: String }, // The question as text
          S3url: { type: String }, // Optional S3 URL
        },
        options: [
          {
            text: { type: String }, // The option as text
            S3url: { type: String }, // Optional S3 URL
          },
        ],
        correctOption: {
          text: { type: String }, // The correct answer as text
          S3url: { type: String }, // Optional S3 URL
        },
        marks: {
          type: Number,
        },
      },
    ],
    totalMarks: {
      type: Number,
      required: [true, "A DPP must have total marks"],
    },
    dueDate: {
      type: Date,
      index: true,
    },
  },
  { timestamps: true }
);

// Optimized index for query performance
dppSchema.index({ user: 1, dueDate: -1 });

export const DPP = mongoose.model("DPP", dppSchema);
