import mongoose from 'mongoose'

const subtodoSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    complete:{
        type:Boolean,
        default:false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObejectId,
        ref:'User'
    }
},{timestamps:True})

export const subTodo=mongoose.model("subTodo",subtodoSchema)