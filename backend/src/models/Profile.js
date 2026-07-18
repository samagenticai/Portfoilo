import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'portfolio', unique: true },
    fullName: { type: String, default: '', trim: true },
    professionalTitle: { type: String, default: '', trim: true },
    animatedTitles: [{ type: String }],
    shortBio: { type: String, default: '', trim: true },
    heroDescription: { type: String, default: '', trim: true },
    profileImage: { type: String, default: '' },
    location: { type: String, default: '', trim: true },
    email: { type: String, default: '', trim: true },
    phone: { type: String, default: '', trim: true },
    phoneE164: { type: String, default: '', trim: true },
    githubUrl: { type: String, default: '', trim: true },
    githubDisplay: { type: String, default: '', trim: true },
    linkedinUrl: { type: String, default: '', trim: true },
    linkedinDisplay: { type: String, default: '', trim: true },
    website: { type: String, default: '', trim: true },
    yearsOfExperience: { type: Number, default: 0 },
    availability: { type: String, default: '', trim: true },
    skillsHeading: { type: String, default: '', trim: true },
    skillsDescription: { type: String, default: '', trim: true },
    skillsDescription2: { type: String, default: '', trim: true },
  },
  { timestamps: true },
)

export const Profile =
  mongoose.models.Profile || mongoose.model('Profile', profileSchema)
