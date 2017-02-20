import mongoose from 'mongoose'

const managerSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  create_time: { type: Date, default: Date.now },
  last_modified: { type: Date, default: Date.now }
})

export default mongoose.model('Manager', managerSchema)
