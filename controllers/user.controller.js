import User from '../models/user.model.js'

export const get_users = async (req, res, next) => {
  try{
    //Find all the users
    const users = await User.find()
    
    //Send bacl the users with a status code  
    res.status(200).json({ success: true, data: users })
  }catch(error){
    next(error)
  }
}

export const get_user = async (req, res, next) => {
  try{
    //Find a user based on the request body param id section and retrun everything except the password
    //The req.params.id gets the id number from the endpoint from the user.routes.js file
    const user = await User.findById(req.params.id).select( '-password' )
    
    if(!user){
      const error = new Error('User not found')
      error.statusCode = 404
      throw error
    }
    
    //Send bacl the users with a status code  
    res.status(200).json({ success: true, data: user })
  }catch(error){
    next(error)
  }
}

export const update_user = async (req, res, next) => {
  try{
    const id = req.params.id
    const user = await User.findById(id)

    if(!user){
      const error = new Error(`No user was found with the id ${id}`)
      error.statusCode = 404
      throw error
    }

    const toUpdate = 'name'
    const toUpdateTo = 'John Doe'
    const updateObject = {[toUpdate]: toUpdateTo}
    const options = {new: true}
    const newUser = await User.findByIdAndUpdate(id, updateObject, options)
    console.log(newUser)

    if(!newUser){
      const error = new Error('There was an error while updating')
      throw error
    }
    
    res.status(200).json({success: true, message: 'The user update was successful'})
  }catch(error){
    next(error)
  }
}

export const delete_user = async (req, res, next) => {
  try{
    const id = req.params.id
    const user = await User.findById(id)
    
    if(!user){
      const error = new Error(`There was no user with the id ${id}`)
      error.statusCode = 404
      throw error
    }

    const deleted_user = await User.deleteOne({ _id: id})

    res.status(200).json({succes: true, message: `The user with the id ${id} has been deleted`})
  }catch(error){
    next(error)
  }
} 