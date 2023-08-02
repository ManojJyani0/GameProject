import { gameController, transactionController, userController } from "../../controllers/index.mjs";
import express from "express";
import {allReadyJoind, userAuth, userExistsCheck, utrExistsCheck} from "../../middleware/index.mjs";
// import {last10Recorescachehit, redisCacheHit} from "../../cache/index.mjs";
const router = express.Router();

//user related routes

router.post("/ragistration",userExistsCheck,userController.regestration);
router.post("/login",userController.login);
router.get("/me",userAuth,userController.me)
router.get("/bankAccounts",userAuth,userController.getBankAccounts)

//mobile number verification
router.post("/veryfyOTP",userAuth,userController.verifyOTP);
router.get("/regenrate",userAuth,userController.generateOTP);

//Transaction Routes

router.post("/withdrawal",userAuth,transactionController.handleWithdrawal)
router.post("/deposit",[userAuth,utrExistsCheck ],transactionController.handleDeposit)
router.get("/transaction",userAuth,transactionController.getTransactions);
router.get("/getBalance",userAuth,transactionController.getBalance)
router.get("/winningPrices",userAuth,transactionController.winningPrices)


// add or delete bankAccouts 
// router.post("/addBankAccount",userAuth,transactionController.addBankAccount)
// router.delete("/removeBankAccount/:accountNumber",userAuth,transactionController.removeBankAccount)
// router.get("/refillDetails",userAuth,transactionController.refillDetails)

//game router
router.get("/currentGame",[userAuth],gameController.currentGame); //
router.post("/joinGame",[userAuth,allReadyJoind],gameController.joinGame); //
router.get("/lastRecords",[userAuth ],gameController.lastTenRecords); //


export default router;