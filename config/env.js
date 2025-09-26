//Importing the config module from dotenv
import { config } from 'dotenv'

//Creating a path for NODE_ENV which .env file setup should the code use[production/developemnt]
config({path: `.env.${process.env.NODE_ENV || 'development'}.local`})

//Exporting the PORT, NODE_ENV, DATABASE URI from the selected .env file above
export const { 
  PORT, NODE_ENV,
  DB_URI,
  JWT_SECRET, JWT_EXPIRE,
  ARCJET_ENV, ARCJET_KEY,
  QSTASH_TOKEN, QSTASH_URL,
  SERVER_URL
} = process.env