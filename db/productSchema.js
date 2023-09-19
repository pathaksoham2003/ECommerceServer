const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity:{
    type:Number,
    required:true
  },
  rating: {
    type: Number,
    default:1,
  },
  imageUrl: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  storeID:{
    type:String,
    required:true
  },
  storeDetails: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store',
    required: true
  }
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
