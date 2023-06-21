


import { Transaction } from "../models/index.mjs";
import { CustomErrorHandler } from "../services/index.mjs";
import { depositSchema } from "../validator/index.mjs";

const utrExistsCheck = async (req, res, next) => {
  const { error, value } = depositSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  try {
    const transaction = await Transaction.findOne({ UTR:value.UTR });
    if (transaction) {
      return next(CustomErrorHandler.alreadyExist("UTR is alredy exist"));
    }
  } catch (error) {
    return next(error);
  }
  return next();
};

export default utrExistsCheck;
