import { createClient } from "redis";
import clientResponse from "../utils/response.mjs";
const client = createClient();
await client.connect();
export {client}


client.on("error", (err) => console.log("Redis Client Error", err));
export const redisCacheHit = async (req, res, next) => {
  console.log("inside the cache hit middleware");
  try {
    const currentGame = await client.get("currentGame");
    console.log(currentGame)
    if (currentGame){
      return clientResponse(res, 200, true, await JSON.parse(currentGame));
    }
    else  return next();
  } catch (error) {
    return next(error);
  }
};

export const last10Recorescachehit = async (req, res, next) => {
  console.log("inside the cache last 10 records hit middleware");
  try {
    const last10Records = await client.get("last10Records");
    if (last10Records !== null)
      return clientResponse(res, 200, true, JSON.parse(last10Records));
    else return next();
  } catch (error) {
    return next();
  }
};
