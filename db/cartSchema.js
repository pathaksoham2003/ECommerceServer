const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    userID:{
        type:String,
        required:true
    },
    storeID:{
        type:String,
        required:true
    },
    productDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required: true
    }
    }
) 
const Cart = mongoose.model("Cart",cartSchema);
module.exports = Cart