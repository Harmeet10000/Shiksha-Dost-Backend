
import { Comment } from "../models/commentModel.js";
import { createOne, deleteOne, getAll } from "./handlerFactory.js";

export const getBlogComments = getAll(Comment, "user");

export const addComment = createOne(Comment);

export const deleteComment = deleteOne(Comment);
