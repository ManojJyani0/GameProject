import express from "express";
// import { userAuth, adminAuth } from "../middleware/index.mjs";
import { adminController } from "../../controllers/index.mjs";
import {adminAuth, userAuth} from "../../middleware/index.mjs";


const router = express.Router();
// admin login routes
router.post("/login", adminController.adminLogin);
router.get("/all", adminController.allContest);
//for geting all trasaction 
router.get("/transaction",[userAuth,adminAuth],adminController.pendingTransaction);

//update the spacific trasaction
router.patch("/transaction/:id",[userAuth,adminAuth],adminController.updateTransaction);

// update QR-CODE details for changing accounts 
router.post("/updateQR",[userAuth,adminAuth],adminController.updateQR);

router.get("/pendingTransaction",[userAuth,adminAuth],adminController.pendingTransaction);
router.get("/pendingRequest",[userAuth,adminAuth],adminController.pendingRequest);

export default router;
