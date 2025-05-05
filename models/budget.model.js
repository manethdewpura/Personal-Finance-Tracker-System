import mongoose from 'mongoose';

const budgetSchema = new mongoose.Schema({
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
    spending:[
       {
        yearandmonth: {
            type: String,
            required: true
        },
        spentAmount: {
            type: Number,
            default: 0
        }
       }
    ],
    description: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories',
        required: true
    },
},
{
    timestamps: true
});

budgetSchema.pre('save', function(next) {
    const currentDate = new Date();
    const yearMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
    
    if (!this.spending || this.spending.length === 0) {
        this.spending = [{
            yearandmonth: yearMonth,
            spentAmount: 0
        }];
    } else {
        const hasCurrentMonth = this.spending.some(s => s.yearandmonth === yearMonth);
        if (!hasCurrentMonth) {
            this.spending.push({
                yearandmonth: yearMonth,
                spentAmount: 0
            });
        }
    }
    next();
});

const Budget = mongoose.model('Budget', budgetSchema);
export default Budget;