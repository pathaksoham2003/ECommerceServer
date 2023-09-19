const Store = require("../db/storeSchema");
const Product = require("../db/productSchema");
const express = require("express");
const jwt = require("jsonwebtoken");
const storeRouter = express.Router();
const secretKey = "YXNkZmFzZGZhc2RmYXNkZmFzZGZhc2Rm";
 
// FOR PRODUCTS IN A STORE
storeRouter.get("/products/:storeID", async (req, res) => {
  const {storeID} = req.params;
  try {
    const data = await Product.find({storeID:storeID});
    console.log(data)
    return res.status(201).json(data);
  } catch (err) {
    return res.status(422).json(err);
  }
});
// FOR SIGN UP PAGE
storeRouter.post("/createstore" , async(req,res)=>{
  try {
    const { name, password , email} = req.body;
    if ((!name || !password || !email)) {
      return res.status(400).json("Please fill the complete information");
    }
    const newStore = new Store({
      name,
      password,
      email
    });
    await newStore.save();
    const id = newStore._id.toString();
    const token = jwt.sign({id} , secretKey,{expiresIn : '1h'});
    return res.status(201).json({token,id});
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
}); 
// FOR LOG IN PAGE
storeRouter.post("/checkstore" , async(req,res)=>{
  const {email,password} = req.body;
  const data = await Store.findOne({email:email});
  const id = data? data._id : null;
  if(!data){
    return res.status(203).json("User Not Found");
  }else if(data.password!==password){
    return res.status(203).json("Incorrect Password");
  }else{
    const token = jwt.sign({id} , secretKey,{expiresIn : '1h'});
    res.status(202).json({token,id});
  }
})
module.exports = storeRouter;