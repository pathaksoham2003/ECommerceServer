const mongoose = require("mongoose");
require('dotenv').config();
// Paste your MongoDB Atlas connection URL below
const dbURL = process.env.MONGODB_URL;
mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.log(err);
    })