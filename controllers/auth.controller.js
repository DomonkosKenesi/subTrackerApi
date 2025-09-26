import mongoose from 'mongoose'
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { JWT_EXPIRE, JWT_SECRET } from '../config/env.js'
import Blacklist from '../models/blacklist.model.js'

export const sign_up = async (req, res, next) => {
  //Implement the sign up logic
  const session = await mongoose.startSession()
  session.startTransaction()

  try{
    const {name, gmail, password} = req.body

    const existingUser = await User.findOne({gmail})

    if(existingUser){
      
      const error = new Error('User already exists')
      error.statusCode = 409
      
      throw error
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUsers = await User.create([{name: name,gmail: gmail, password: hashedPassword}], {session})
    const token = jwt.sign({ userID: newUsers[0]._id }, JWT_SECRET, {expiresIn: JWT_EXPIRE})

    await session.commitTransaction()
    session.endSession()

    res.status(201).json({success: true, message: 'User created', data: {token, user: newUsers[0]}})

  }catch(error){
      await session.abortTransaction()
      session.endSession()
      next(error)
  }

}

export const sign_in = async(req, res, next) => {
  try{

    //Deconstract the body and get the gmail and password from the request
    const { gmail, password } = req.body
    
    //Create a user const from the data base woth the matching gmail
    const user = await User.findOne({ gmail })

    //If there is no mathcing gmail user will be false => raise an error
    if(!user){
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }

    //Compare password with the password from the request
    const isPasswordValid = await bcrypt.compare(password, user.password)
    
    //If password does not match with the one in the database return an error
    if(!isPasswordValid){
      const error = new Error('Password incorrect')
      error.statusCode = 401
      throw error
    }

    //Get a new token with jwt from the database for the usr_id
    const token = jwt.sign({ userID: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRE })

    //Send back a json object containing toke, user, and message
    res.status(200).json({
      success: true,
      message: 'User signed in succesfully',
      data:{token, user}
    })

  }catch(error){
    next(error)
  }



}

export const sign_out = async(req, res, next) => {
  try{
    const token = req.headers['authorization'].split(' ')[1]
    
    const ex_tok = await Blacklist.findOne({ token: token })
    if(ex_tok){
      const error = new Error("Something is fucked up")
      throw error
    }
    const signed_out = await Blacklist.create([{token: token}])
    console.log(signed_out)
    res.status(200).send('Logged out');
  }catch(error){
      res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
  //res.end()
}