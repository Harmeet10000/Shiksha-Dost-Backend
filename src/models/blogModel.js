import mongoose from "mongoose";
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    mentor: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    img: {
      type: String,
    },
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    category: {
      type: String,
      default: "general",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: true,
    },
    visit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
