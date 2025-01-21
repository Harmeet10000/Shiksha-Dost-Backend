import crypto from "crypto";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";

const mentorSchema = new Schema(
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
    bio: {
      type: String,
    },
    description: {
      type: String,
    },
    skills: {
      type: [String],
    },
    role: {
      type: String,
      enum: ["mentor"],
      default: "mentor",
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: 8,
      select: false,
    },
    unavailability: [
      {
        date: {
          type: Date,
          required: true,
        },
        slots: [
          {
            start: {
              type: String,
              required: true,
            },
            end: {
              type: String,
              required: true,
            },
          },
        ],
      },
    ],
    totalMentees: {
      type: Number,
      default: 0,
    },
    revenue: {
      weekly: {
        type: Map, // Using Map to store week number as key and revenue as value
        of: Number,
        default: {},
      },
      monthly: {
        type: Map, // Using Map to store month (e.g., "2025-01") as key and revenue as value
        of: Number,
        default: {},
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

mentorSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

mentorSchema.pre("save", async function (next) {
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

mentorSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

mentorSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

mentorSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

export const Mentor = mongoose.model("Mentor", mentorSchema);
