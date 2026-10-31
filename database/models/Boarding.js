const mongoose = require('./mongoose');

const boardingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
    city: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true, minlength: 20 },
    price: { type: Number, required: true, min: 1000 },
    deposit: { type: Number, default: 0, min: 0 },
    type: {
      type: String,
      enum: ['Single Room', 'Shared Room', 'Annex', 'Studio'],
      required: true,
    },
    gender: {
      type: String,
      enum: ['Any', 'Male', 'Female'],
      required: true,
    },
    beds: { type: Number, min: 1, max: 20, default: 1 },
    baths: { type: Number, min: 1, max: 10, default: 1 },
    availableSpots: { type: Number, min: 0, default: 1 },
    amenities: [{ type: String }],
    image: { type: String, required: true },
    images: [{ type: String }],
    phone: { type: String, required: true, trim: true },
    featured: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

boardingSchema.index({ title: 'text', city: 'text', location: 'text', description: 'text' });

module.exports = mongoose.model('Boarding', boardingSchema);
