import mongoose from 'mongoose';

const Session = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        length: {
            type: Number,
            required: true,
        },
        finished: { type: Boolean, required: true, default: false },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Session', Session);
