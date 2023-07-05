import { Account, Transaction, User } from "../../models/index.mjs";
import {CustomErrorHandler} from "../../services/index.mjs";
import {clientResponse} from "../../utils/index.mjs";
import { getUserBalance, getWinningPrice } from "../../utils/message.mjs";
import { depositSchema, withdrawalSchema } from "../../validator/index.mjs";




const transactionController = {
    //for featching user reletaed transactions
    getTransactions: async (req, res, next) => {
        try {
            const transactionList = await Transaction.find({userId:req.user._id}).select(["-_id","-userId","-__v","-updatedAt"]).sort({createdAt:-1}).limit(10);
            // const balance = await getUserBalance(transactionList)
            return clientResponse(res, 200, true,transactionList)        
        } catch (error) {
            return next(error)
        }
    },
    getBalance:async (req, res, next)=>{
        try {
            const transactionList = await Transaction.find({userId:req.user._id});
            const balance = await getUserBalance(transactionList)
            const winningCoins = transactionList.reduce((acc,doc)=>(doc.transactionType==="PriceMoney")?acc+=doc.amount:acc,0)
            const user = await User.findById(req.user._id);
            if(user){
                user.amount = balance;
                user.winningCoins = winningCoins;
                // console.log(user)
                await user.save();
            }

            return clientResponse(res, 200, true,{balance,winningCoins} )
            } catch (error) {
            return next(error)
        }
    },
    //for winning money
    winningPrices:async (req, res, next)=>{
        try {
            const transactionList = await Transaction.find({userId:req.user._id});
            return clientResponse(res, 200 ,true, {amount:getWinningPrice(transactionList)})
        } catch (error) {
            return next (error);
        }
    },
    //for handling withdrawal request 
    /*
        This route is very confidation and very much spcia for check for more and more for not compromiseing the data of this code 
        kal jake or modification karna h

    */
    handleWithdrawal: async (req, res, next) => {
        try {
        // Get User's Balance from Database
        const {error,value} = withdrawalSchema.validate(req.body)
        if(error){
            return next(error)
        }
        const transactionList = await Transaction.find({userId:req.user._id});
        const balance = await getUserBalance(transactionList)

        // Check if User Has Enough Balance
        console.log(balance)
        if (balance >= value.amount) {
            // Create Transaction Object
            const transaction = new Transaction({
                ...value,
                userId: req.user._id,
                transactionType: "Withdrawal",
            });
            // Save Transaction to Database
            await transaction.save();

            // upadating balance in users account via transactions
            const user = await User.findById(req.user._id);
            user.amount = balance;
            await user.save();
            // Return Success Notification
            return clientResponse(res,200,true,{ message: "Withdrawal request make successfuly!" });
        } else {
            // Return Insufficient Balance Error Message
            return next(CustomErrorHandler.notEnoughBalance("Insufficient balance!"))
        }
    } catch (error) {
        return next(error)
    }
    },


    //for handling deposit request
    handleDeposit: async (req, res, next) => {
        const {error ,value } = depositSchema.validate(req.body);
        if(error){
            return next(error)
        }
        const {amount, UTR,} = value;
        try {
            await Transaction.create({amount,UTR,userId:req.user._id, transactionType:"Deposit" });
            return clientResponse(res, 200, true, {message:"Your Transaction is Successfully Genrated"});
        } catch (error) {
            return next (error)
        }
    },
    addBankAccount:async (req, res, next)=>{
        const {error, value} = req.body
    },
    removeBankAccount:async (req, res, next)=>{

    },
    refillDetails:async (req, res, next)=>{
        try {
            const data = await Account.find();
            return clientResponse(res, 200, true,data[0])
        } catch (error) {
            return next (error)
        }
    }
}


export default transactionController;