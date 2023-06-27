// import redisClient from './index.mjs'

// const redisCacheHit = async (req, res, next) => {
//   try {
//     const currentGame = await redisClient.get("currentGame");
//     if(currentGame!==null)
//       return clientResponse(res, 200, true, currentGame);
//     else 
//       return next();
//   } catch (error) {
//     return next();
//   }
// };

// export default redisCacheHit;
