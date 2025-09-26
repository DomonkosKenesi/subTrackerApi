import mongoose from 'mongoose'

const blacklistSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      ref: "User"
    },
  },
  {timestamps: true}
)

const Blacklist = mongoose.model('Blacklist', blacklistSchema)

export default Blacklist