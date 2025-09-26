//Importing mongoose NoSQL database manager module
import mongoose from 'mongoose'

//Creating a subscriptionSchema with mongoose for the DatabBase to use as a framework
const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Subscription name is required'],
      trim: true,
      minLength: 2,
      maxLength: 20
    },

    price: {
      type: Number,
      required: [true, 'Subscription price is required'],
      min: 0,

    },

    currency: {
      type: String,
      //Creating multiple acceptable instances for the input
      enum: ['USD', 'EUR', 'GBP', 'HUF'],
      //Making it the defult input if there is none
      defult: 'USD'
    },

    frequency: {
      type: String,
      //Creating multiple acceptable instances for the input
      enum: ['daily','weekly', 'monthly', 'yearly']
    },

    category: {
      type: String,
      required: [true, 'Category is required']
      
    },

    paymentMethod: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      //Creating multiple acceptable instances for the input
      enum: ['active', 'cancelled', 'expired'],
      //Making it the defult input if there is none
      default: 'active'
    },

    startDate: {
        type: Date,
        required: [true, 'Starting date is required'],
        //Creating a validation function so the startDate must be valid
        /*validate: {
          validator: (date) => value <= new Date(),
          message: 'Start date must be in the past'
        }*/
    },

    renewalDate: {
        type: Date,
        //Creating a validation function so the startDate must be valid
        validate: {
          validator: function (date) {
            return value > this.startDate
          },
          message: 'Renewal date must be later than the starting date'
        }
    },

    user: {
      //Defining the input as an other DataBase objectID
      type: mongoose.Schema.Types.ObjectId,
      //Accepting only user ubject IDs
      ref: 'User',
      required: true,
      index: true,
    }
  },
  {timestamps: true}
)

//Auto calculate the missing renwal date
//.pre function runs before the creation save
subscriptionSchema.pre('save', function(next){
  if(!this.renewalDate){
    const renewalPeriods = {
      'daily': 1,
      'weekly': 7,
      'monthly': 30,
      'yearly': 365,
    }
    
    this.renewalDate = new Date(this.startDate)
    this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency])
  }

  if(this.renewalDate < new Date()){
    this.status = 'expired'
  }
  //Call this to procede to the creation to the database
  next()
})

//Creating the Subscription database model based on the subscriptionSchema
const Subscription = mongoose.model('Subscription', subscriptionSchema)

//Exporting the Subscription database model as default so it can be imported in the app.js file
export default Subscription