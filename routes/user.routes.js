//Import the route creation module from express
import { Router } from 'express'

import { get_users, get_user, update_user,delete_user } from '../controllers/user.controller.js'
import authorize from '../middlewares/auth.middleware.js'


//Initialze the Route creation in userRouter varibale
const userRouter = Router()


//Creating differnet routes[endpoints] for different HTTP requests
userRouter.get('/', authorize, get_users)

userRouter.get('/:id', authorize, get_user)

//I havent figured out if i need this or not becuse i have register auth route
userRouter.post('/', (req, res) => {
  res.send('Create new user')
})

userRouter.put('/:id', authorize, update_user)

userRouter.delete('/:id', delete_user)

//Exporting the routes as default so it can be imported in the app.js file
export default userRouter