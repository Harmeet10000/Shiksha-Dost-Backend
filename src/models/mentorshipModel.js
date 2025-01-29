import mongoose from "mongoose";
const { Schema } = mongoose;

const mentorshipSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    mentor: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
      index: true,
    },
    schedule: {
      on: {
        type: Date, // The date of the session
        required: [true, "A schedule must have a date"],
        index: true,
      },
      start: {
        type: String, // Start time in HH:mm format
        required: [true, "Start time is required for the schedule"],
      },
      end: {
        type: String, // End time in HH:mm format
        required: [true, "End time is required for the schedule"],
      },
    },
    razorpay_order_id: {
      type: String,
      unique: true,
    },
    paymentDetails: {
      type: Object,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    meetingLink: {
      type: String,
    },
    isCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
      },
      comments: {
        type: String,
      },
    },
    rescheduleCount: {
      type: Number,
      default: 0,
    },
    cancellationReason: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Pending", "Scheduled", "In Progress", "Completed", "Cancelled"],
      default: "Pending",
      index: true,
    },
  },
  { timestamps: true }
);

// Add compound indexes
mentorshipSchema.index({ user: 1, status: 1 }); // Optimize user-specific status queries
mentorshipSchema.index({ mentor: 1, status: 1 }); // Optimize mentor-specific status queries
mentorshipSchema.index({ schedule: 1 }); // Optimize schedule-related queries

// Query middleware to populate user and mentor fields
mentorshipSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name email profile_imageURL", 
  }).populate({
    path: "mentor",
    select: "name email profile_imageURL",  
  });
  next();
});

export const Mentorship = mongoose.model("Mentorship", mentorshipSchema);
