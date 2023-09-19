const Product = require("../db/productSchema");
const mongoose = require("mongoose");
const express = require("express");
const productRouter = express.Router();

// GET ALL PRODUCTS 
productRouter.get("/allproducts", async (req, res) => {
  try {
    const data = await Product.find();
    return res.status(201).json(data);
  } catch (err) {
    return res.status(422).json(err);
  }
});
// GET THE SIMILAR CATEGORY PRODUCTS
productRouter.get("/:cat", async (req, res) => {
  const {cat,productID} = req.params;
  try {
    const data = await Product.find({ category: cat });
    return res.status(201).json(data);
  } catch (err) {
    console.log(err);
  }
});

// CREATE PRODUCT FOR A STORE
productRouter.post("/:storeID", async (req, res) => {
  const { storeID } = req.params;
  const { name, price, quantity, imageUrl, description, category } = req.body;
  try {
    if ((!name, !price, !quantity, !imageUrl, !description, !category)) {
      res.status(201).json("Please fill the complete data");
    }
    const storeDetails = new mongoose.mongo.ObjectId(storeID);
    const createproduct = new Product({
      name,
      price,
      quantity,
      imageUrl,
      description,
      category,
      storeID,
      storeDetails,
    });
    await createproduct.save();
    res.status(201).json("The product was added");
  } catch (err) {
    res.status(422).json(err);
  }
});
// For the page of the store to delete a particular product
// this will remove the product details/object from the products database
// and will also update the owner array to remove the id of the deleted product
// productid of the product to be deleted has to provided in the body of the request
productRouter.delete("/:productID", async (req, res) => {
  try {
    const {productID} = req.params;
    await Product.findByIdAndDelete(productID);
    res.status(201).json("The product was successfully deleted");
  } catch (err) {
    res.status(422).json(err);
  }
});

module.exports = productRouter;
