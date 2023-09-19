const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    productDetails: {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required: true
    },
    userDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    storeDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Store",
        required:true
    },
    }
) 
const Order = mongoose.model("Order",orderSchema);
module.exports = Order