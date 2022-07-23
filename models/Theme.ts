import mongoose from 'mongoose';

const themeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    colour: [{ type: Number, required: true }],
    interval: { type: Number, required: true, default: 5 },
    isDefault: { type: Boolean, default: false },
});

export default mongoose.model('Theme', themeSchema);
