import mongoose from 'mongoose'

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  tags: { type: String, required: true },
  image: { type: String, required: true },
  lessons: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    videoSrc: { type: String, required: true },
    time: { type: Date, required: true },
    advise_time: { type: Date, required: true }
  }],
  create_time: { type: Date, default: Date.now },
  last_modified: { type: Date, default: Date.now }
})

export default mongoose.model('Course', courseSchema)
