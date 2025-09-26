//These two line are needed to create the require function so i can read in the serve function of upstash
import { createRequire } from 'module'
import Blacklist from '../models/blacklist.model.js'

const require = createRequire(import.meta.url)
//This is not an import because it is an esm module so import not works on them
const cron = require('node-cron')


//This is important if the code is running on a server continuously so it deletes the expired jwt token from the blacklist
const blacklistCleanup = () => {
  cron.schedule('0 0 * * *', async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    await Blacklist.deleteMany({ createdAt: { $lt: yesterday } });
    
    console.log('Old blacklisted tokens deleted successfully');
  } catch (error) {
    console.error('Error deleting old blacklist entries:', error);
  }
});
}

export default blacklistCleanup
