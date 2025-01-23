
import { Material } from "../models/materialModel.js";
import { createOne, getAll } from "./handlerFactory.js";

export const addMaterial = createOne(Material);
export const getMaterial = getAll(Material);