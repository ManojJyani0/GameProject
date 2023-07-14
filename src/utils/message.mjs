// import twilio from 'twilio'
// import { TWILIO_AUTH_TOKEN, TWILIO_ACCOUNT_SID }from '../../config/index.mjs'
import { Transaction } from "../models/index.mjs";

// const client = twilio(TWILIO_ACCOUNT_SID,TWILIO_AUTH_TOKEN)

// export const sendMessageToUser =(OTP, MobileNumber)=>{
// client.messages
//     .create({
//         body: `YOUR NUMBER PUZZLE OTP NUMBER IS : ${OTP}`,
//         from: '+12543904542',
//         to: `+91${MobileNumber}`
//     })
//     .then(message => console.log(message.sid))
//     .done();

// }
export const genrateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const getUserBalance = async (transactionList) => {
  
const balance = transactionList.reduce((total, transaction) => {
    if (
      transaction.transactionType === "Deposit" &&
      transaction.status === "Success"
    ) {
      return total + transaction.amount;
    } 
    else if(transaction.transactionType==="PriceMoney"){
      return total + transaction.amount;
    }
    else if(transaction.transactionType==="JoinGame"){
      return total - transaction.amount;
    }
    else if (
      transaction.transactionType === "Withdrawal" &&
      transaction.status !== "Faild"
    ) {
      return total - transaction.amount;
    } 
    else {
        return total;
    }
  }, 0);
  return +balance;
};
// export const getUserBalance = async (transactionList) => {
//   const balance = transactionList.reduce((total, transaction) => {
//     switch (transaction.transactionType) {
//       case "Deposit":if (transaction.status === "Success") {
//         return transaction.amount;
//       }
//       break;
//       case "PriceMoney":
//         if (transaction.status === "Success") {
//           return -transaction.amount;
//         }
//         break;
//       case "JoinGame":if (transaction.status === "Success") {
//         return transaction.amount;
//       }
//       break;
//       case "Withdrawal":
//         if (transaction.status !== "Failed") {
//           return -transaction.amount;
//         }
//         break;
//       default:
//         return total;
//     }
//     return total;
//   }, 0);
  
//   return +balance;
// };
export const getWinningPrice = (transactionList) => {
  const balance = transactionList.reduce((total, transaction) => {
    if (transaction.transactionType === "PriceMoney") {
      console.log(transaction.amount)
      return total + transaction.amount;
    }
    return total;
  }, 0);
  return +balance;
};