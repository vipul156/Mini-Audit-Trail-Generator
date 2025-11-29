import { model, models, Schema } from "mongoose"

const versionSchema = new Schema({
  id: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  timestamp: { type: Number, required: true },
  addedWords: { type: [String], default: [] },
  removedWords: { type: [String], default: [] },
  oldLength: { type: Number, default: 0 },
  newLength: { type: Number, default: 0 },
  summary: { type: Object, default: {} }
}, { 
  collection: 'versions',
  timestamps: false 
})


const Version = models.Version || model('Version', versionSchema)

export default Version