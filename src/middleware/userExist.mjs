import { User } from "../models/index.mjs";
import { CustomErrorHandler } from "../services/index.mjs";
import { userSchema } from "../validator/user.mjs";

const userExistsCheck = async (req, res, next) => {
  const { error, value } = userSchema.validate(req.body);
  if (error) {
    return next(error);
  }
  try {
    const user = await User.findOne({ mobile: value.mobile });
    console.log(user)
    if (user) {
      return next(CustomErrorHandler.alreadyExist("User is alredy exist"));
    }
  } catch (error) {
    return next(error);
  }
  return next();
};

export default userExistsCheck;
