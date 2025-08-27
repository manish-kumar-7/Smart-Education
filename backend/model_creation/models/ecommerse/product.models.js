import mongoose from 'mongoose'
const productSchema= new mongoose.Schema({
    description:{
        type:String,
        required:true
    },
    name:{
        required:true,
        type:String
    },
    prodectImage:{
        type:String,
    },
    price:{
        type:number,
        default:0,

    },
    stock:{
        default:0,
        type:Number
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"category",
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    }
},{timestamps:true})
export const product=mongoose.model('product',productSchema)