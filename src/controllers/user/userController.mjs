import clientResponse from "../../utils/response.mjs";
import {
  loginSchema,
  userSchema,
  OTPValidation,
} from "../../validator/index.mjs";
import bcrypt from "bcryptjs";
// import twilio from "twilio";

import { User, OTP } from "../../models/index.mjs";
import { genrateOTP } from "../../utils/message.mjs";

import { CustomErrorHandler, JwtService } from "../../services/index.mjs";
import { updateAccountBalance } from "../game/halper.mjs";
import { message } from "./message.mjs";

const userController = {
  async regestration(req, res, next) {
    const { error, value } = userSchema.validate(req.body);
    console.log(value);
    if (error) {
      return next(error);
    }
    const hash = await bcrypt.hash(value.password, 10);
    const { name, mobile } = value;
    const user = new User({
      name,
      mobile,
      password: hash,
    });
    if (user) {
      try {
        await user.save();
      } catch (error) {
        return next(error);
      }
    }
    try {
      return clientResponse(res, 201, true, {
        message: "user Created Successfully",
      });
    } catch (error) {
      return next(error);
    }
  },

  // login route
  async login(req, res, next) {
    const { error, value } = loginSchema.validate(req.body);
    // body data validation
    if (error) {
      return next(error);
    }
    let user = null;
    // finding user in databse
    try {
      user = await User.findOne({ mobile: value.mobile });
    } catch (error) {
      return next(error);
    }
    console.log(user);
    if (!user) {
      return next(
        CustomErrorHandler.notfound("User id and password not found")
      );
    }

    // matching password hash
    const isMatch = await bcrypt.compare(value.password, user.password);
    if (!isMatch) {
      return next(CustomErrorHandler.wrongCredentials());
    }
    const token = user?.roleType==="Admin"? JwtService.sign({ _id: user._id, roleType:user.roleType }):JwtService.sign({ _id: user._id });
    await updateAccountBalance(user._id);
    return clientResponse(res, 200, true, token);
  },
  // genrate otp for multyPerpose
  async generateOTP(req, res, next) {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        throw CustomErrorHandler.notfound("User not found");
      }
      const generatedOTP = genrateOTP();
      let otpSMS;
      try {
        otpSMS = {
          return: true,
          request_id: "0pvmeakdoitncb1",
          message: ["SMS sent successfully."],
        };
        //await message(generatedOTP, user.mobile);
        if (otpSMS) {
          await OTP.create({ sid: otpSMS.request_id, OTP: generatedOTP });
        }
      } catch (error) {
        console.log(error);
        return next(error);
      }
      return clientResponse(res, 200, true, {
        sid: otpSMS.request_id,
        message: otpSMS?.message[0],
      });
    } catch (error) {
      console.log(error);
      return next(error);
    }
  },
  //   otp varifiction in registraiton and other thing
  async verifyOTP(req, res, next) {
    const { error, value } = OTPValidation.validate(req.body);

    if (error) {
      return next(error);
    }

    try {
      console.log(value);
      const result = await OTP.findOne({ sid: value.sid });
      console.log(result);
      if (!result) {
        return next(CustomErrorHandler.OTPExpired());
      }

      if (result.OTP !== value.OTP) {
        return next(CustomErrorHandler.OTPinValid());
      }
      // some varnabaliti is avalable heare

      const user = await User.findById(req.user._id);

      if (!user) {
        return next(CustomErrorHandler.notfound("User not found")).select([
          "-password",
        ]);
      }

      user.accountVarification = true;
      await user.save();

      return clientResponse(res, 202, true,{message:"OTP verify succesfullyc"});
    } catch (error) {
      return next(error);
    }
  },
  // UserInfo ROute
  async me(req, res, next) {
    try {
      const result = await User.findById(req.user._id).select([
        "-password",
        "-createdAt",
        "-updatedAt",
        "-__v",
      ]);
      if (!result) {

        return next(CustomErrorHandler.notfound("User not found"));
      }
      
      return clientResponse(res, 200, true, result);
    } catch (error) {
      return next(error);
    }
  },
};

export default userController;
