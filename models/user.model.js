//Importing mongoose NoSQL database manager module
import mongoose from 'mongoose'

//Creating a userSchema with mongoose for the DatabBase to use as a framework
const userSchema = new mongoose.Schema(
  {
    //Creating a name variable and defineing what can go inside it
    name: {
      //Define the type
      type: String,
      //Define if it is required or not
      required: [true, 'User name is required'], 
      //Triming
      trim: true, 
      //Defining the min/max length of the input
      minLength: 2, 
      maxLength: 15
    },
    
    gmail: {
      type: String, 
      required: [true, 'User gmail is required'],
      //Define if it has to be unique or can already exist in the database
      unique: true, 
      trim: true, 
      //Making the input lowercase
      lowercase: true, 
      minLength: 5, 
      maxLength: 15,
      match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/]
    },
    
    password: {
        type: String,
        required: [true, 'User password is required'],
        minLength: 8,
    }
  },
  //Requireing timestamps for each instance creation
  {timestamps: true}
)

//Makeing the User variable the database model based on the userSchema
const User = mongoose.model('User', userSchema)

//Exporting the User database model as default so it can be imported in the app.js file
export default User