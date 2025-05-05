import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'USD'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
    tags:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tags'
    },
    budget:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Budget',
        nullable: true
    },
    goal:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Goal',
        nullable: true
    },
    description: {
        type: String,
        required: true
    },
    recurring: {
        interval: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            default: null
        },
        nextOccurrence: {
            type: Date,
            default: null
        },
        endDate: {
            type: Date,
            default: null
        }
    },

},
{
    timestamps: true
});

transactionSchema.methods.getNextOccurrence = function() {
    if (!this.recurring.interval) return null;

    const nextOccurrence = new Date(this.recurring.nextOccurrence || this.createdAt);
    switch (this.recurring.interval) {
        case 'daily':
            nextOccurrence.setDate(nextOccurrence.getDate() + 1);
            break;
        case 'weekly':
            nextOccurrence.setDate(nextOccurrence.getDate() + 7);
            break;
        case 'monthly':
            nextOccurrence.setMonth(nextOccurrence.getMonth() + 1);
            break;
        case 'yearly':
            nextOccurrence.setFullYear(nextOccurrence.getFullYear() + 1);
            break;
    }

    if (this.recurring.endDate && nextOccurrence > this.recurring.endDate) {
        return null;
    }

    return nextOccurrence;
};

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;