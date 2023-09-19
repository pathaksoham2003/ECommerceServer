const mongoose = require("mongoose");
// Paste your MongoDB Atlas connection URL below
const dbURL = "mongodb+srv://pathaksoham2003:IphoneYoutube@cluster0.16f8znq.mongodb.net/ecommerce?retryWrites=true&w=majority";
mongoose.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.log(err);
    })
    
