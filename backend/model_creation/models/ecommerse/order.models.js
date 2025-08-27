import mongoose from 'mongoose'
const orderItemSchema=new mongoose.Schema({
    prodeuctId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"product"
    },
    quantity:{
        type:Number,
        required:true
    }
})
const orderSchema=new mongoose.Schema({
    orderPrice:{
        type:Number,
        required:true
    },
    customer:{
        type:mongoose.Schema.Types.ObejectId,
        ref:'Users'
    },
    orderItems:{
        type:[orderItemSchema]
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["PENDING","CANCELLED","DELIEVERED"],
        DEFAULT:"PENDING"
    }

},{timestamps:true})
export const order=mongoose.model("order",orderSchema)