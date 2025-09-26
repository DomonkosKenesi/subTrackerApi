//Import different modules
import express from 'express'
import cookieParser from 'cookie-parser'

//Import the PORT definec in the env.js file
import { PORT } from './config/env.js'

//IMport the routes[endpoints] from the user, auth, subsrciption routes file
import userRouter from './routes/user.routes.js'
import authRouter from './routes/auth.routes.js'
import subscriptionRouter from './routes/subscriptions.routes.js'
//Importing the databse connect function from the mongodb.js file
import connnectToDatabase from './database/mongodb.js'
//Importing the middware[error handling] created in the error.middleware.js file
import errorMiddleware from './middlewares/error.middleware.js'
import arcjetMiddleware from './middlewares/arject.middleware.js'
import workflowRouter from './routes/workflow.routes.js'

import blacklistCleanup from './middlewares/blacklist.clear.js'//Initialze the express extension
const app = express()

//Express built in error handling
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
//This is the function imported from arcjet.middleware which uses the arcjet bot and DDos protection
app.use(arcjetMiddleware)

//Initialze the route enpoints with different routes
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/subscriptions', subscriptionRouter)
app.use('/api/v1/workflows', workflowRouter)

//Importing and using the errorMiddleware create in the error.middleware.js
app.use(errorMiddleware)

//Createing the base paage endpoint
app.get('/',(req,res) => {
  res.send('Wellcome Babes')
})

//Immported blacklist cleanup method to get rid of the expired blacklisted jwt tokens
blacklistCleanup()

//Initialze the sever on the PORT imported above
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`)
  
  //Connecting to the database with the imported function above[created int he database file than exported as default]
  await connnectToDatabase()
})

//Exporting as default the app
export default app