const mongoose = require('./mongoose');

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'owner'], default: 'student' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Boarding' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
