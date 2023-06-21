import unirest from "unirest";
import { FAST2SMS_AUTHORIZATION_HEADER } from "../../../config/index.mjs";
export const message = async (OTP, mobile) => {
  var req = await unirest
    .post("https://www.fast2sms.com/dev/bulkV2")
    .headers({
      authorization: FAST2SMS_AUTHORIZATION_HEADER,
      Accept: "application/json",
      "Content-Type": "application/json",
    })
    .send({
      variables_values: OTP,
      route: "otp",
      numbers: mobile,
    })
    if(req.error){
      return new Error(req.error)
    }
  return req.body;
};
