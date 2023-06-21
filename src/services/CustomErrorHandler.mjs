class CustomErrorHandler extends Error {
    constructor(status, message) {
      super();
      this.status = status;
      this.message = message;
    }
    //this is for when your alredy singin 
    static alreadyExist(message) {
      return new CustomErrorHandler(409, message);
    }
    //this is error for worng Cridenstion
    static wrongCredentials(message = "user name and password not match.") {
      return new CustomErrorHandler(401, message);
    }
    //this is error for when user not found in database
    static notfound(message="404 not found"){
      return new CustomErrorHandler(404,message);
    }
    //this is the code for when password not match
    static unAuthorized(message = "unAuthorized") {
      return new CustomErrorHandler(401, message);
    }
    //this is error for when multer error or server filesystem error
    static serverError(message) {
      return new CustomErrorHandler(428,message);
      }
    static notEnoughBalance(message="user don't have enough coin to join game"){
      return new CustomErrorHandler(400,message);
    }
    static gameEnd(massage){
      return new CustomErrorHandler(410,massage);
    }static OTPinValid(){
      return new CustomErrorHandler(409,"OTP is invalid");
    }static OTPNotvarified(){
      return new CustomErrorHandler(409,"OTP is verified");
    }
    static OTPExpired(){
      return new CustomErrorHandler(410,"OTP is Expired");
    }
    static OTPResendLimitexceeded(){
      return new CustomErrorHandler(429,"OTP resend limit exceeded");
    }


  }
  
  export default CustomErrorHandler;
  