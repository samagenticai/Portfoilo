import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'portfolio', unique: true },
    filePath: { type: String, default: '' },
    url: { type: String, default: '' },
    fileName: { type: String, default: '' },
    originalName: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Resume =
  mongoose.models.Resume || mongoose.model('Resume', resumeSchema)
