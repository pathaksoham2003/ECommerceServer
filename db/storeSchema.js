const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  address:{
    type: String,
  }
});

const Store = mongoose.model('Store', storeSchema);

module.exports = Store;
