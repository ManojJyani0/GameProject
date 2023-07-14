import { APP_PORT } from './config/index.mjs'
import app from './src/app.mjs'

app.listen(APP_PORT,()=>{
    console.log(`Server is runing at port ${APP_PORT}`)
})