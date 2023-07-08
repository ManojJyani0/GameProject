import { Contest, Transaction, User } from "../../models/index.mjs";
import { getUserBalance } from "../../utils/index.mjs";

export const updateAccountBalance = async (userDocId) => {
  // Update the user's account balance in the database
  const user = await User.findById(userDocId).select("-AccountNumbers");
  const transactionList = await Transaction.find({ userId: userDocId });
  user.amount = await getUserBalance(transactionList);
  await user.save();
  console.log(
    `Updated account balance for user ${user.mobile} after transaction ${user.amount}`
  );
};

//for genrating randam number for wining conditions
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const handleWin = async (contestId) => {
  try {
    const priGame = await Contest.findOneAndUpdate(
      { contestId },
      { $set: { status: "Closed", winningPrice: getRandomInt(10200, 18800) } },
      { new: true }
    );
    // Calculate the total bet amount
    if(priGame?.players.length<10){
      WINNING_MODE = "SECOND_MOST"
    }
    if (priGame?.players.lenght !== 0) {
      priGame.totalAmount = priGame?.players.reduce(
        (total, player) => total + player.betAmount,
        0
        );
      } else {
      priGame.totalAmount = 0;
    }

    // Find out the most selected number
    const findMostNumberSelected = priGame.players.reduce((acc, val) => {
      acc[val.number] = (acc[val.number] || 0) + 1;
      return acc;
    }, {});

    if(priGame.players.length!==0){

      switch (WINNING_MODE) {
        case "MAX_WINNER": // Find the winning number with the highest count
          priGame.winningNumber = parseInt(
            Object.keys(findMostNumberSelected).reduce((a, b) =>
              findMostNumberSelected[a] < findMostNumberSelected[b] ? b : a
            )
          );
          break;
        case "LOWEST_WINNER":
          // Find the winning number with the lowest count
          priGame.winningNumber = parseInt(
            Object.keys(findMostNumberSelected).reduce((a, b) =>
              findMostNumberSelected[a] > findMostNumberSelected[b] ? b : a
            )
          );
          break;
        case "SECOND_MOST":
          // Find the second most selected winning number
          priGame.winningNumber = parseInt(
            Object.keys(findMostNumberSelected).sort(
              (a, b) => findMostNumberSelected[b] - findMostNumberSelected[a]
            )[1]
          );
          break;
        case "SECOND_LAST":
          // Find the second last selected winning number
          priGame.winningNumber = parseInt(
            Object.keys(findMostNumberSelected).sort(
              (a, b) => findMostNumberSelected[a] - findMostNumberSelected[b]
            )[1]
          );
          break;
        default:
          priGame.winningNumber = getRandomInt(0, 9);
          break;
      }
    }else{
      priGame.winningNumber = getRandomInt(0, 9);
    }

    // Find out the winning players
    const winningPlayers = priGame.players.filter(
      (player) => player.number === priGame.winningNumber
    );

    // Calculate the prize amount for the winning player(s)
    const winningPlayersAmount = winningPlayers.reduce(
      (total, player) => (total += player.betAmount),
      0
    );
    const prizePool = priGame.totalAmount * 0.8;
    const lousersAmount = prizePool - winningPlayersAmount;

    // Calculate the winning amount for each player based on their betAmount
    const winnersRatio = winningPlayers.map((player) => {
      return player.betAmount / winningPlayersAmount;
    });
    const sumofRatio = winnersRatio.reduce((acc, value) => (acc += value), 0);

    // Create a transactionList of the prize money and leftover money
    const transactionList = winningPlayers.map((player, index) => {
      const playerPrizeMoney =
        player.betAmount +
        Math.floor((lousersAmount / sumofRatio) * winnersRatio[index]);

      return {
        userId: player.userId,
        amount: playerPrizeMoney,
        transactionType: "PriceMoney",
        status: "Success",
        UTR: `PriceMoney${priGame.contestId}${player.userId}`,
      };
    });

    const leftoverAmount = priGame.totalAmount - prizePool;
    priGame.adminErnning = winningPlayers.length!==0?leftoverAmount:priGame.totalAmount;
    priGame.winners = winningPlayers;

    const fullAdminAmount = transactionList.reduce((acc, transaction) => {
      acc += parseInt(transaction.amount);
      return acc;
    }, 0);
    priGame.diff =
      priGame.totalAmount - priGame.adminErnning - parseInt(fullAdminAmount);
    await Transaction.insertMany(transactionList);
    await priGame.save();
  } catch (error) {
    console.log(error);
    // throw new Error("Error occurred: ", error);
  }
};

export const startNewGame = async () => {
  try {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const numContestPlayed = await Contest.countDocuments({
      contestId: { $regex: `^${today}` },
    });
    const contestId = today + ("000" + numContestPlayed).slice(-3);
    CURRENT_GAME = contestId;

    const isCurrentGameDivisibleBy1000 = CURRENT_GAME % 1000 === 0;

    if (isCurrentGameDivisibleBy1000) {
      const yesterday = new Date(Date.now() - 86400000)
        .toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
        .slice(0, 10)
        .replace(/-/g, "");
      const numPrevDayGames = await Contest.countDocuments({
        contest: { $regex: `^${yesterday}` },
      });
      const preGameContestId = yesterday + ("000" + numPrevDayGames).slice(-3);
      PRE_GAME = preGameContestId;
    } else {
      PRE_GAME = contestId - 1;
    }
    
    
    const gameEndTime = new Date(Date.now() + 3 * 60 * 1000);
    const gameState = new Contest({ contestId, gameEndTime });
    await gameState.save();
    if(PRE_GAME>0){
      handleWin(PRE_GAME);
    }
    setTimeout(startNewGame, 3 * 60 * 1000);
  } catch (error) {
    console.log(error);
  }
};
