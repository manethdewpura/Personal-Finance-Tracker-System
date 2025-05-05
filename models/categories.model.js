import  mongoose  from 'mongoose';


const categoriesSchema = new mongoose.Schema({

    category:{
        type: String,
        required: true,
        unique: true,
    },
    description:{
        type: String,
        required: true,
    },
},
{
    timestamps: true
})

const Categories = mongoose.model('Categories', categoriesSchema);
export default Categories;