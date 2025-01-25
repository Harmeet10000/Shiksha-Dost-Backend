import crypto from "crypto";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please tell us your name!"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    profile_imageURL: {
      type: String,
      default: "default.jpg",
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    savedPosts: {
      type: [String],
      default: [],
    },
    solvedDPPs: [
      {
        dpp: {
          type: Schema.Types.ObjectId,
          ref: "DPP",
        },
        obtainedMarks: {
          type: Number,
          default: 0,
        },
        userAnswers: [
          {
            question: {
              type: Schema.Types.ObjectId,
              required: true,
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
        startAt: {
          type: Date,
        },
        submittedAt: {
          type: Date,
        },
      },
    ],
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.index({ email: 1, isVerified: 1 });

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) {
      return next();
    }

    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.createEmailVerificationToken = function () {
  const verificationToken = crypto.randomBytes(32).toString("hex");
  this.emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  return verificationToken;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export const User = mongoose.model("User", userSchema);

