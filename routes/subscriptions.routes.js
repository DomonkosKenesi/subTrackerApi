//Importing the route creation module from express
import { Router } from 'express'
import authorize from '../middlewares/auth.middleware.js'
import { cancelUserSubscription, createSubscription,
         deleteSubscription,
         getSubscriptions, 
         getUserSubscriptions,
         getSubscriptionDetails,
         updateSubscription,
       } from '../controllers/subscription.controller.js'

//Initialzing the route creation in subscriptionRouter variable
const subscriptionRouter = Router()

//Creating different routes[endpoints] for differenr HTTP requests
subscriptionRouter.get('/',authorize, getSubscriptions)

subscriptionRouter.get('/:id',authorize, getSubscriptionDetails)

//Have to call authorize middleware so it passes on the varified user id
subscriptionRouter.post('/', authorize, createSubscription)

subscriptionRouter.put('/:id', authorize, updateSubscription)

subscriptionRouter.delete('/:id', authorize, deleteSubscription)

subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions)

subscriptionRouter.put('/user/cancel/:sub_id',authorize, cancelUserSubscription)

//Exporting the routes as default so it can be imported in the app.js file  
export default subscriptionRouter