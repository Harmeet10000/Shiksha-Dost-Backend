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
          text: { type: String },  
          S3url: { type: String },  
        },
        options: [
          {
            text: { type: String },   
            S3url: { type: String },  
          },
        ],
        correctOption: {
          text: { type: String },  
          S3url: { type: String }, 
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
