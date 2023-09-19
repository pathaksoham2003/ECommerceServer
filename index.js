require("./db/connection");
require('dotenv').config();
//PMAK-64b194a7369a0a003f7e206c-3f61ed93d90dd3ebb2abfeb331d21ceee0
const userRouter = require("./routes/userRoutes");
const productRouter = require("./routes/productRoutes");
const storeRouter = require("./routes/storeRoutes");
const express = require("express");
const app = express();
const port = 3001;
const cors = require("cors");
app.use(cors({origin:"*"}));
app.use(express.json());
app.use("/user",userRouter);
app.use("/product",productRouter);
app.use("/store",storeRouter);
app.listen(port,()=>{
    console.log("Welcome to a server");
})