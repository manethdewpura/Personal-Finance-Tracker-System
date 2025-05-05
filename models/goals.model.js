import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currentAmount: {
        type: Number,
        default: 0
    },
    description: {
        type: String,
        required: true
    },
    monthlyContribution: {
        type: Number,
        nullable: true,
        default: null
    },
},
{
    timestamps: true
});

const Goal = mongoose.model('Goal', goalSchema);
export default Goal;