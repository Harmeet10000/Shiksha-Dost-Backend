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
          type: String,
          required: [true, "A problem must have a question"],
        },
        options: {
          type: [String],
          required: [true, "A problem must have options"],
        },
        correctOption: {
          type: String,
          required: [true, "A problem must have a correct option"],
        },
        marks: {
          type: Number,
          required: [true, "A problem must have marks"],
        },
        S3url: {
          type: String,
          required: [true, "A DPP must have a S3 URL"],
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

dppSchema.index({ user: 1, dueDate: -1 });

export const DPP = mongoose.model("DPP", dppSchema);
