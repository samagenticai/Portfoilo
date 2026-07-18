import mongoose from 'mongoose'

const resumeSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'portfolio', unique: true },
    filePath: { type: String, default: '' },
    url: { type: String, default: '' },
    cloudinaryPublicId: { type: String, default: '' },
    cloudinaryResourceType: { type: String, default: 'raw' },
    pdfData: { type: Buffer, select: false, default: null },
    fileName: { type: String, default: '' },
    originalName: { type: String, default: '' },
    fileSize: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Resume =
  mongoose.models.Resume || mongoose.model('Resume', resumeSchema)
