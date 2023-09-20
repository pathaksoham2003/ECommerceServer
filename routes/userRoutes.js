const express = require("express");
const User = require("../db/userSchema.js");
const Order = require("../db/orderSchema.js");
const Cart = require("../db/cartSchema.js");
const jwt = require("jsonwebtoken");
const userRouter = express.Router();
const mongoose = require("mongoose");
// FOR USER SIGN UP PAGE
const secretKey = "YXNkZmFzZGZhc2RmYXNkZmFzZGZhc2Rm";
userRouter.post("/createuser", async (req, res) => {
  try {
    const { name, password , email} = req.body;
    if ((!name || !password || !email)) {
      return res.status(400).json("Please fill the complete information");
    }
    const newUser = new User({
      name,
      password,
      email
    });
    await newUser.save();
    const id = newUser._id.toString();
    const token = jwt.sign({id} , secretKey,{expiresIn : '1h'});
    return res.status(201).json({token,id});
  } catch (error) {
    console.log(error);
    return res.status(422).json(error);
  }
});
// FOR USER LOG IN PAGE
userRouter.post("/checkuser" , async(req,res)=>{
  const {email,password} = req.body;
  const data = await User.findOne({email:email});
  const id = data? data._id : null;
  if(!data){
    return res.status(203).json("User Not Found");
  }else if(data.password!==password){
    return res.status(203).json("Incorrect Password");
  }else{
    const token = jwt.sign({id} , secretKey,{expiresIn : '1h'});
    res.status(201).json({token,id});
  }
})
// FOR USER INFO ON PROFILE
userRouter.get("/:userID", async (req, res) => {
  try {
    const {userID} = req.params;
    const data = await User.findOne({_id : userID});
    res.status(201).json(data);
  } catch (err) {
    res.status(422).json(err);
  }
});

userRouter.get("/getuserbyid/:id", async (req, res) => {
  try {
    const {id} = req.params;
    const data = await User.findById({ _id: id });
    res.status(201).json(data);
  } catch (err) {
    res.status(422).json(err);
  }
});
userRouter.patch("/:userID", async (req, res) => {
  try {
    const {userID} = req.params;
    const { name, email, address , imageUrl} = req.body;
    if ((!name ,!email)) {
      res.status(201).json("Please fill the complete information");
    }
    await User.findByIdAndUpdate(
      userID,
      { name,email, address , imageUrl},
      { new: true }
    );
    res.status(201).json("The data was updated");
  } catch (err) {
    res.status(422).json(err);
  }
});
userRouter.delete("/:userID",async(req,res)=>{
  try{
    const {userID}= req.params;
    await User.findByIdAndDelete(userID);
    res.status(201).json("The data was deleted");
  }catch(err){
    res.status(422).json(err);
  }
})
userRouter.post("/addtocart" , async(req,res)=>{
  try{
    const {productID,userID,storeID} = req.body;
    const productObjId = new mongoose.mongo.ObjectId(productID);
    console.log(productObjId);
    const addedProduct = new Cart({productDetails:productObjId,userID:userID,storeID:storeID});
    await addedProduct.save()
    res.status(201).json("Item Added To Cart");
  }catch(err){
    res.status(422).json("Error"+err);
  }
})
userRouter.get("/gcart/:userID",async(req,res)=>{
  try{
    const data = await Cart.find({userID:req.params.userID}).populate({path:"productDetails",select:"name price imageUrl"}).lean();
    const formattedData = data.map((cartItem) => ({
      _id: cartItem.productDetails._id,
      name: cartItem.productDetails.name,
      price: cartItem.productDetails.price,
      imageUrl: cartItem.productDetails.imageUrl[0],
    }));
    //console.log(formattedData);
    res.status(201).json(formattedData);
  }catch(err){
    res.status(422).json(err);
  }
})
userRouter.delete("/deletecart/:productID",async(req,res)=>{
  try{
    const {productID} = req.params;
    const productDetails = new mongoose.mongo.ObjectId(productID);
    const deleted = await Cart.findOneAndDelete({productDetails:productDetails});
    res.status(201).json(deleted);
  }catch(err){
    res.status(422).json(err)
  }
})
//place order
userRouter.post("/placeorder",async(req,res)=>{
  try{const {userID,productID,storeID} = req.body;
  const userDetails = new mongoose.mongo.ObjectId(userID);
  const productDetails = new mongoose.mongo.ObjectId(productID);
  const storeDetails = new mongoose.mongo.ObjectId(storeID);
  const order = new Order({
    userDetails:userDetails,
    productDetails:productDetails,
    storeDetails:storeDetails,
  }) 
  await order.save();
  res.status(201).json(order);
}catch(err){
    res.status(422).json(err);
  }
})
userRouter.get(`/gorder/:userID` , async(req,res)=>{
  const {userID} = req.params;
  try{
    const userDetails = new mongoose.mongo.ObjectId(userID);
    const data = await Order.find({userDetails:userDetails}).populate({path:"productDetails" , select:"name price imageUrl"}).lean();
    const formattedData = data.map((cartItem) => ({
      _id: cartItem.productDetails._id,
      name: cartItem.productDetails.name,
      price: cartItem.productDetails.price,
      imageUrl: cartItem.productDetails.imageUrl[0],
    }));
  console.log(formattedData);
  res.status(201).json(formattedData);
  }catch(err){
    res.status(422).json(err);
  }
})
module.exports = userRouter;

// integrating payment gateway
// 
// userRouter.post("/create-checkout-session" , async(req,res)=>{
//   try {
//     const session = stripe.checkout.sessions.create({
//       payment_method_types:['card'],
//       mode:'payment', // subscription
//       line_items: req.body.items.map(async(item)=>{
//         // the following storeItems object will be coming from the backend database of mongodbAtlas
//         const storeItem = await Product.findById(item.id);
//         return {
//           price_data: {
//             currency:"inr",
//             product_data:{
//               name: storeItem.name
//             },
//             unit_amount: storeItem.price
//           },
//           quantity: item.quantity
//         }
//       }),
//       // Which url to go when the payment session is successful
//       success_url: `${process.env.CLIENT_URL}/success`,
//       // Which url to go when the payment session is not successful
//       cancel_url: `${process.env.CLIENT_URL}/cancel`
//     })
//     res.json({url: session.url});
//   }catch(err){
//     res.status(500).json({error:e.message})
//   }
// })
/*
SECOND WAY OF INTEGRATING STRIPE :-
const stripe = require('stripe')(process.env.STRIPE_SERVER_KEY);

server.post('/create-payment-intent', async (req, res) => {
  const { totalAmount, orderId } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100, // for decimal compensation
    currency: 'inr',
    automatic_payment_methods: {
      enabled: true,
    },
    metadata: {
      orderId,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});
*/

