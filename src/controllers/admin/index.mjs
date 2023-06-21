import clientResponse from "../../utils/response.mjs";
import { Account, Contest, Transaction, User } from "../../models/index.mjs";
import { CustomErrorHandler, JwtService } from "../../services/index.mjs";
import bcrypt from "bcryptjs";
import { loginSchema } from "../../validator/index.mjs";
import { handleMultipartData } from "../../middleware/index.mjs";

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
      user = await User.findOne({ mobile: value.mobile });
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
  async updateQR(req, res, next) {
    handleMultipartData(req, res, async (err) => {
      try {
        if (err) {
          return next(CustomErrorHandler.serverError(err.message));
        }

        const filePath = req.file.path;

        //create a crop
        let document = null;
        try {
          const { upiID, AccountHolder } = req.body;
          document = await Account.create({
            upiID,
            AccountHolder,
            imageUrl: filePath,
          });
        } catch (error) {
          return next(error);
        }
        return clientResponse(res, 201, true, document);
      } catch (error) {
        //this error is basical for file uploaed or not
        if (
          error.message ===
          "Cannot read properties of undefined (reading 'path')"
        ) {
          return next(CustomErrorHandler.serverError("image is required"));
        }
        return next(error);
      }
    });
  },
};

export default adminController;
