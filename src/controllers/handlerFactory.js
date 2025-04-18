import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import APIFeatures from "../utils/apiFeatures.js";

export const getAll = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};

    if (req.params.id && Model.modelName === "Blog") {
      // Handle mentor blogs (e.g., /getMentorBlogs/:id)
      filter = { author: req.params.id };
    } else if (req.params.blogId && Model.modelName === "Comment") {
      // Handle blog comments (e.g., /:blogId/)
      filter = { blog: req.params.blogId };
    } else if (req.user.role === "mentor" && Model.modelName === "Mentorship") {
      filter = { mentor: req.user.id };
    } else if (req.user.role === "user" && Model.modelName === "Mentorship") {
      filter = { mentor: req.user.id };
    }
    // console.log(filter);
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    if (popOptions) features.query = features.query.populate(popOptions);
    // console.log(features.query);

    const doc = await features.query;

    if (!doc || doc.length === 0) {
      return next(
        new AppError(`No documents found with the given criteria`, 404)
      );
    }

    res.status(200).json({
      status: "success",
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });

  export const getAllCursor = catchAsync(async (req, res, next) => {
    // Create a features instance with cursor pagination
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .limitFields()
      .cursorPaginate();

    // Execute the query
    let items = await features.query;

    // Check if there are more results
    const hasMore = items.length > req.query.limit;
    if (hasMore) {
      // Remove the extra item we fetched to check if there are more
      items.pop();
    }

    // Get the cursor for the next/prev page
    const nextCursor = hasMore ? items[items.length - 1]._id : null;

    res.status(200).json({
      status: "success",
      results: items.length,
      data: {
        items,
        pagination: {
          hasMore,
          nextCursor,
        },
      },
    });
  });

export const getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let doc;

  if (Model.modelName === "Blog") {
    doc = await Model.findOne({ slug: req.params.slug });
    if (popOptions) doc = await doc.populate(popOptions);
  } else {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    doc = await query;
  }

    if (!doc) {
      return next(new AppError("No document found with that ID or slug", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const createOne = (Model) =>
  // eslint-disable-next-line no-unused-vars
  catchAsync(async (req, res, next) => {
    if (Model.modelName === "Blog") {
      req.body.author = req.user._id;
    }

    if (Model.modelName === "Comment") {
      req.body.user = req.user._id;
      req.body.blogId = req.params.blogId;
    }

    const doc = await Model.create(req.body);

    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

export const blockOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndUpdate(id, { active: false });

    if (!doc) {
      return next(new AppError("No document found with that ID", 404));
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
