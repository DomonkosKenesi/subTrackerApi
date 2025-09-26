import { JWT_SECRET } from "../config/env.js"
import jwt from 'jsonwebtoken'
import User from "../models/user.model.js"
import Blacklist from "../models/blacklist.model.js"

const authorize = async(req,res, next) => {
  try{
    
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
      token = req.headers.authorization.split(' ')[1]
    }

    if(!token) return res.status(401).json({ message: 'Unauthorzied' })
      
    const checkIfBlacklisted = await Blacklist.findOne({ token: token }); // Check if that token is blacklisted
    // if true, send an unathorized message, asking for a re-authentication.
    if(checkIfBlacklisted)
        return res
            .status(401)
            .json({ message: "This session has expired. Please login" });
    
    const decoded = jwt.verify(token, JWT_SECRET)

    const user_ = await User.findById(decoded.userID)

    if(!user_) return res.status(401).json({ message: 'Unauthorzied' });

    req.user = user_

    next()
  }catch(error){
    res.status(401).json({ message: 'Unathrorized', error: error.message })
  }
}


export default authorize