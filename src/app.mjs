import express, { json, urlencoded } from "express"
import http from 'http'
import { errorHandler } from "./middleware/index.mjs";
import cors from 'cors'
import { dbConnecation } from "./db/index.mjs";
import { publiRouter,adminRouter } from "./routes/index.mjs";
import { startNewGame } from "./controllers/game/halper.mjs";
//galobal variable for currrent and privies state 
global.CURRENT_GAME=null;
global.PRE_GAME = 0;
global.WINNING_MODE= 1;
global.UPI_ID="9660119161@ybl";
const app = express();
app.use(cors())
dbConnecation()
// debugger;
// Start the first game immediately =
// this new game runs only once in cluster mode write for this s
startNewGame();
app.use('/uploads',express.static("uploads"))
app.use(urlencoded({extended:true}))
app.use(json({limit:"10mb"}))
app.use("/api/admin", adminRouter)
app.use("/api/public",publiRouter)


app.use(errorHandler)
var server = http.Server(app)

export default server;