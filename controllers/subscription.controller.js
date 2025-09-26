import { workflowClient } from "../config/upstash.js"
import Subscription from "../models/subscription.model.js"
import { SERVER_URL } from "../config/env.js"


export const getSubscriptions = async (req, res, next) => {
  try{
    const subscriptions = await Subscription.find()

    res.status(200).json({ success: true, data: subscriptions })

  }catch(error){
    next(error)
  }
}

export const deleteSubscription = async (req, res, next) => {
  const id = req.params.id
  try{
    const result = await Subscription.findById(id)
    console.log(req.user._id)
    if(!result || result.user.toString() !== req.user._id.toString()){
      const error = new Error(`The subscription with id ${id} was not found with the user id of the request`)
      error.statusCode = 404
      throw error
    }
    
  const alma = await Subscription.deleteOne({ _id: id})
    
    res.status(200).json({success: true, message: `The subscription ${result.name} with id ${id} has been deleted`})
  }catch(error){
    next(error)
  }
}

export const createSubscription = async (req, res, next) => {
  try{
    const subscription = await Subscription.create({
      //Spreading the reqest body and passing it in as an object for the data creation
      ... req.body,
      //This is giving the user parameter the reqests user id[this is not part of the req body => comming from the auth.middleware]
      user: req.user._id,
    })
/*
    await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body:{subscriptionId: subscription.id}
    })*/

    res.status(201).json({ success: true, data: {subscription}})

  }catch(error){
    next(error)
  }
}

export const getUserSubscriptions = async (req, res, next) => {
  try{

    if(req.user.id != req.params.id){
      const error = new Error('You are not the owner of this account')
      error.stauts = 401
      throw error
    }

    const subscriptions = await Subscription.find({ user: req.params.id })

    res.status(200).json({ success: true, data: subscriptions})

  }catch(error){
    next(error)
  }
}

export const cancelUserSubscription = async (req, res, next) => {
  try{

    const id = req.params.sub_id
    const subscription = await Subscription.findById(id)

    if(req.user._id.toString() !== subscription.user.toString()){
      const error = new Error('Incorrect user account')
      error.statusCode = 401
      throw error
    }
    
    //Have to convert the ids to string because they are object by default
    if(!subscription || subscription.user.toString() !== req.user._id.toString()){
      const error = new Error(`No subscription with this ID: ${id} for the user ${req.user.id}`)
      throw error
    }
    
    console.log(subscription)
    await Subscription.updateOne({_id: id}, {$set: {status: 'cancelled'}})
    console.log(subscription)

    res.status(200).json({suscces: true, message: `The subscription ${subscription.name} with ID: ${id} has been cancelled`})
  }catch(error){
    next(error)
  }
}

export const getSubscriptionDetails = async (req, res, next) => {
  try{
    const subscription = await Subscription.findById(req.params.id)
    
    if(!subscription){
      const error = new Error(`This subscription with ${id} is not existing`)
      error.statusCode = 404
      throw error
    }

    res.status(302).json({succes: true, data: subscription})
  }catch(error){
    next(error)
  }
}


export const updateSubscription = async (req, res, next) => {
  try{

    const id = req.params.id
    const stuffToUpdate = 'paymentMethod'
    const stuffToUpdateTo = 'Cash'
    const updateObject = { [stuffToUpdate]: stuffToUpdateTo}
    const options = { new: true }
    let subscriptionToUpdate = await Subscription.findById(id)

    if(!subscriptionToUpdate || subscriptionToUpdate.user.toString() !== req.user._id.toString()){
      const error = new Error(`There is no subscription with the id: ${id} to update for the user ${req.user._id.toString()}`)
      error.statusCode = 404
      throw error
    }
    subscriptionToUpdate = await Subscription.findByIdAndUpdate(id,updateObject, options)
    res.status(200).json({success: true, message: "Update was succesull"})

  }catch(error){
    next(error)
  }
}