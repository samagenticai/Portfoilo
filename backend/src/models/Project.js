import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    fullDescription: { type: String, default: '', trim: true },

    coverImage: { type: String, default: '' },
    galleryImages: [{ type: String }],

    category: { type: String, default: 'Web App', trim: true },
    techStack: [{ type: String }],
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    projectStatus: {
      type: String,
      enum: ['Completed', 'In Progress', 'Coming Soon'],
      default: 'Completed',
    },

    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: false },
    displayOrder: { type: Number, default: 0 },
    badge: {
      type: String,
      enum: ['', 'New', 'Featured', 'Client Project', 'Personal Project'],
      default: '',
    },

    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: { type: String, default: '' },
    },

    // Optional rich fields for portfolio layouts (auto-filled if empty)
    problem: { type: String, default: '' },
    solution: { type: String, default: '' },
    features: [{ type: String }],
    accent: { type: String, default: 'from-primary/20 via-secondary/10 to-primary/15' },
  },
  { timestamps: true },
)

projectSchema.index({ title: 'text', shortDescription: 'text', slug: 'text' })
projectSchema.index({ published: 1, featured: 1, displayOrder: 1 })

export const Project =
  mongoose.models.Project || mongoose.model('Project', projectSchema)
