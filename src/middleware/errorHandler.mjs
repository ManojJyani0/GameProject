import { DEBUG_MODE } from "../../config/index.mjs";
import JOI_PKG from 'joi'
import { clientResponse } from "../utils/index.mjs";
import { CustomErrorHandler } from "../services/index.mjs";
import JWTPKG from "jsonwebtoken";
const {ValidationError} = JOI_PKG;
const { JsonWebTokenError } = JWTPKG;
const errorHandler = async (err, req, res, next) => {
  // logic
  let statusCode = 500;
  let data = {
    message: "Internal server error",
    ...(DEBUG_MODE === "true" && { originalError: err.message }),
  };
  if (err instanceof ValidationError) {
    statusCode = 422;
    data = {
      message: err.message,
    };
  }
  if (err instanceof CustomErrorHandler) {
    statusCode = err.status;
    data = {
      message: err.message,
    };
  }
  if( err instanceof JsonWebTokenError){
    statusCode = 401;
    data ={
      message : err.message,
    }
  }

  return clientResponse(res, statusCode, false, data);
};

export default errorHandler;