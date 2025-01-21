
import { Material } from "../models/materialModel.js";
import { createOne } from "./handlerFactory.js";

export const addMaterial = createOne(Material);