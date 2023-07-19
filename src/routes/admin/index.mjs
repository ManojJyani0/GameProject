import express from "express";
// import { userAuth, adminAuth } from "../middleware/index.mjs";
import { adminController } from "../../controllers/index.mjs";
import {adminAuth, userAuth} from "../../middleware/index.mjs";


const router = express.Router();
// admin login routes
router.post("/login", adminController.adminLogin);
router.get("/", adminController.allContest);
/*for geting all trasaction 
@this is deposit requests of user 
*/
router.get("/transactions",[userAuth,adminAuth],adminController.pendingTransaction);
router.get("/requests",[userAuth,adminAuth],adminController.pendingRequest);


router.patch("/transaction/:id",[userAuth,adminAuth],adminController.updateTransaction);
router.post("/setWinningMode",[userAuth,adminAuth],adminController.winningMode)
router.get("/getPromoCodes",adminController.promoCodeList)

router.patch("/updateupi",[userAuth,adminAuth],adminController.setUPIID);
router.get("/updatePromo",[userAuth,adminAuth],adminController.UpdatePromoBanifits);

/*
 @ Admin Offile App Experimental Functions 
 */

//  router.get("/AccountsByDays",  AdminOfflineControler.getAllContest)

export default router;
