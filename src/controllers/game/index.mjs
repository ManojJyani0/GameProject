import { Contest, Transaction, User } from "../../models/index.mjs";
import clientResponse from "../../utils/response.mjs";
import { gameSchema } from "../../validator/game.mjs";
import { CustomErrorHandler } from "../../services/index.mjs";
import { updateAccountBalance } from "./halper.mjs";
// import redisClient from '../../cache/index.mjs'

const gameController = {
  //current game all inforamation
  currentGame: async (rea, res, next) => {
    try {
      console.log(CURRENT_GAME, PRE_GAME);
      const currentGame = await Contest.findOne({ contestId: CURRENT_GAME }).select(["-players","-winners","-__v","-_id","-createdAt","-updatedAt"]);
      // await currentGame.save()
      console.log(currentGame);
      // await redisClient.set('currentGame', JSON.stringify(currentGame));
      return clientResponse(res, 200, true, currentGame);
    } catch (error) {
      return next(error);
    }
  },
  //pre games for records tables
  lastTenRecords : async (req, res, next)=>{
    try {
    const docs = await Contest.find().sort({ createdAt: -1 }).limit(11).select(["-id","-gameEndTime","-status","-players","-winners","-createdAt","-updatedAt","-adminErnning","-_id","-totalAmount","-__v"]);
    docs.shift();
    return clientResponse(res, 200, true, docs);
    } catch (error) {
      return next(error)
    }
  },

  // join Game
  joinGame: async (req, res, next) => {
    const { error, value } = gameSchema.validate(req.body);
    if (error) {
      return next(error);
    }
    const { contestId, number, betAmount } = value;
    const user = await User.findById(req.user._id);
    console.log(user);
    if (user?.amount < betAmount) {
      return next(CustomErrorHandler.notEnoughBalance());
    }
    const contest = await Contest.findOne({ contestId });
    let alreadyExist = contest?.players.findIndex((player)=>player.userId===req.user._id);
    console.log("index of user",alreadyExist);
    if (!contest) {
      return next(new CustomErrorHandler(400, "Invalid contest id"));
    }
    if (contest.gameEndTime < Date.now()) {
      return next(
        CustomErrorHandler.gameEnd(
          `This ${contest.contestId} is end for the time sack you can try in next game`
        )
      );
    }
    if(contest.status==="Closed"){
      return next(CustomErrorHandler.gameEnd("This game is closed due to time try in next game")) ;
    }
    if (contest.contestId === PRE_GAME) {
      return next(
        new CustomErrorHandler.gameEnd("You are in pre game , try in next game")
      );
    }
    try {
      // in this transaction autumeticaly any user cannnot be join the the same game with multiple time
      const transaction = await Transaction.create({
        userId: req.user._id,
        amount: betAmount,
        transactionType: "JoinGame",
        status: "Success",
        UTR: contestId + req.user._id,
      });
      contest.players.push({
        contestId,
        userId: req.user._id,
        number,
        betAmount,
      });
      await contest.save();
      await updateAccountBalance(req.user._id);
    } catch (error) {
      if (error.code === 11000) {
        return next(
          CustomErrorHandler.alreadyExist("you are alredy Joined This game")
        );
      }
      return next(error);
    }
    return clientResponse(res, 200, true, {message:"You are joined this game successfuly."});
  },

  //
};

export default gameController;
