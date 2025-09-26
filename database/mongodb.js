//Importing mongoose module
import mongoose from 'mongoose'
//Importing the Database URI[to access the created databse on mongodb], NODE_ENV from the env.js file
import { DB_URI, NODE_ENV} from '../config/env.js'
import { Db } from 'mongodb'

//Createing an error if the mongoDataBase URI is missing or invalid
if(!DB_URI){
  throw new Error("Please define mongodb")
}

//Async function to connect to the database
const connnectToDatabase = async() =>{
  try{
    //Trying to connect to the mongoDB based off the DB_URO fomr env.js
    await mongoose.connect(DB_URI)

    //Logging a succes
    console.log(`Connected to Database in ${NODE_ENV} mode`)
  }catch(error){
    //Catching an errror and returning it with the error code 1
    console.error("Error connecting to Database:", error)
    process.exit(1)
  }
}

//Exporting the database connection function so it can be imported to the app.js
export default connnectToDatabase