//Importing the Route creation module from experss
import { Router } from 'express'

import { sign_up, sign_in, sign_out } from '../controllers/auth.controller.js'
import authorize from '../middlewares/auth.middleware.js'

//Initialize the router creation in the authRouter variable
const authRouter = Router()

//Creating different routes[endpoints] for different HTTP requests
authRouter.post('/sign-up', sign_up)

authRouter.post('/sign-in', sign_in)

authRouter.post('/sign-out', authorize, sign_out)

//Exporting the routes as default so it can be importted in the app.js file
export default authRouter 