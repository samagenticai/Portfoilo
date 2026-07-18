import mongoose from 'mongoose'

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: {
      type: String,
      enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Others'],
      default: 'Frontend',
    },
    percentage: { type: Number, min: 0, max: 100, default: 80 },
    displayOrder: { type: Number, default: 0 },
    published: { type: Boolean, default: true },
    iconType: { type: String, enum: ['lucide', 'upload'], default: 'lucide' },
    lucideIcon: { type: String, default: 'code2' },
    iconUrl: { type: String, default: '' },
    description: { type: String, default: '', trim: true },
  },
  { timestamps: true },
)

skillSchema.index({ published: 1, displayOrder: 1, createdAt: -1 })

export const Skill = mongoose.models.Skill || mongoose.model('Skill', skillSchema)
