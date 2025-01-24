import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { DPP } from "../models/dppModel.js";


export const getAllDPP = getAll(DPP);

export const getDPP = getOne(DPP);

export const createDPP = createOne(DPP);

export const deleteDPP = deleteOne(DPP);

export const updateDPP = updateOne(DPP);

export const getUserDPP = getAll(DPP);