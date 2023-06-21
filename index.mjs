import { APP_PORT } from './config/index.mjs'
import app from './src/app.mjs'
import path from 'path'
// global.appRoot = path.resolve(__dirname)

app.listen(APP_PORT,()=>{
    console.log(`Server is runing at port ${APP_PORT}`)
})