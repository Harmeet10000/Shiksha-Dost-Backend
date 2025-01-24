import mongoose from "mongoose";
const { Schema } = mongoose;

const blogSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },
    cover_image: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
    },
    category: {
      type: String,
      default: "general",
    },
    content: {
      type: String,
      required: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    visit: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index to optimize queries for featured blogs in a specific category
blogSchema.index({ isFeatured: 1, category: 1 });

// Index on `mentor` field for faster queries when filtering blogs by mentor
blogSchema.index({ mentor: 1 });

// Full-text search index for `title`, `desc`, and `content` fields
blogSchema.index({ title: "text", desc: "text", content: "text" });

// Single-field index on `visit` for sorting blogs by popularity
blogSchema.index({ visit: -1 });

// Single-field index on `category` for filtering blogs by category
blogSchema.index({ category: 1 });
// TTL index on `timestamps` to automatically delete outdated or temporary blogs (optional)
blogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 * 24 * 30 }); // Example: 30 days

export const Blog = mongoose.model("Blog", blogSchema);
