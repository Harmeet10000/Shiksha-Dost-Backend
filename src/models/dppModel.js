import mongoose from "mongoose";
const { Schema } = mongoose;

const dppSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
      type: Number,
      required: [true, "A DPP must have a year"],
    },
    S3url: {
      type: String,
      required: [true, "A DPP must have a S3 URL"],
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
        solution: {
          type: String,
          required: [true, "A problem must have a solution"],
        },
      },
    ],
    totalMarks: {
      type: Number,
      required: [true, "A DPP must have total marks"],
    },
    obtainedMarks: {
        type: Number,
        default: 0,
    },
    userAnswers: [
      {
          question: {
              type: Schema.Types.ObjectId,
              ref: "DPP", // References the `problems` array in DPP
            },
        answer: {
            type: String,
          required: [true, "A user answer must have an answer"],
        },
        isCorrect: {
          type: Boolean,
          required: [true, "A user answer must have an isCorrect field"],
          default: false,  
        },
      },
    ],
    questionsCorrect: {
      type: Number,
      default: 0,
    },
    questionsIncorrect: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      required: [true, "A DPP must have a duration"],
    },
    durationTaken: {
      type: Number,
      default: 0,  
    },
    dueDate: {
      type: Date,
      required: [true, "A DPP must have a due date"],
      index: true,  
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,  
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastAttempt: {
      type: Date,
    },
    questionsAttempted: {
      type: Number,
      default: 0,
    },
    questionsUnattempted: {
      type: Number,
      default: 0,
    },
    givenAt: {
      type: Date,
    },
    submittedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

dppSchema.index({ user: 1, dueDate: -1 });

export const DPP = mongoose.model("DPP", dppSchema);
