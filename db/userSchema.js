const mongoose = require('mongoose');

// Define the schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  imageUrl:{
    type: String,
    default:""
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address: {
    type: String,
    default:""
  },
});

// Create the model
const User = mongoose.model('users', userSchema);
module.exports = User;