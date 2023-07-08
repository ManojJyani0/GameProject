import clientResponse from "../../utils/response.mjs";
import { Account, Contest, Transaction, User } from "../../models/index.mjs";
import { CustomErrorHandler, JwtService } from "../../services/index.mjs";
import bcrypt from "bcryptjs";
import { loginSchema } from "../../validator/index.mjs";

const adminController = {
  async adminLogin(req, res, next) {
    const { error, value } = loginSchema.validate(req.body);
    // body data validation
    if (error) {
      return next(error);
    }
    let user = null;
    // finding user in databse
    try {
      user = await User.findOne({ mobile: value.mobile }).select("-AccountNumbers");
    } catch (error) {
      return next(error);
    }
    // console.log(user);
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
    const token = JwtService.sign({ _id: user._id, roleType: user.roleType });
    return clientResponse(res, 200, true, token);
  },

  // all pending transation get api route

  async pendingTransaction(req, res, next) {
    try {
      const pendingTransaction = await Transaction.find({
        status: "Pending",
        transactionType: "Deposit",
      });

      return clientResponse(res, 200, true, pendingTransaction);
    } catch (error) {
      return next(error);
    }
  },
  // all pending Request get api route

  async pendingRequest(req, res, next) {
    try {
      const pendingTransaction = await Transaction.find({
        status: "Pending",
        transactionType: "Withdrawal",
      });
      console.log(pendingTransaction);
      return clientResponse(res, 200, true, pendingTransaction);
    } catch (error) {
      return next(error);
    }
  },
  //verififing transaction for by using UTR
  async updateTransaction(req, res, next) {
    try {
      const transaction = await Transaction.findById(req.params.id);
      if (!transaction) {
        return next(CustomErrorHandler.notfound("Transaction not found"));
      }
      if (transaction.status === "Pending") {
        console.log(req.body)
        transaction.status = req.body.status;
        await transaction.save();
        return clientResponse(res, 200, true, {message:"Transaction Update Successffuly"});
      } else {
        return clientResponse(res, 200, true, {
          message: "this transaction alredy submited",
        });
      }
    } catch (error) {
      return next(error);
    }
  },

  async allContest(req, res, next) {
    try {
      const all = await Contest.find();
      return clientResponse(res, 200, true, {
        numberOfOContest: all.length,
        Constast: all,
      });
    } catch (error) {
      return next(error);
    }
  },
  async winningMode(req, res, next) {
      WINNING_MODE = req.body.mode;
  },
  
};

export default adminController;
