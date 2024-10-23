const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const exp = require("constants");
const { types } = require("util");
const { type } = require("os");
require("dotenv").config();
 
app.use(express.json());
app.use(cors());




const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch((err) => console.log(err));



app.get("/", (req, res) => {
  res.send("Express app is running");
});

const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

//creating upload endpoint images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

//Schema for creating products
const Product = mongoose.model("Product", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  available: {
    type: Boolean,
    default: true,
  },
});

//api for adding products
app.post("/addproduct", async (req, res) => {
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  }else{
    id=1;
  }
  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("product saved");

  res.json({
    success: true,
    name: req.body.name,
  });
});

//api for removing products
app.post("/removeproduct",async(req,res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("product removed");
    res.json({
        success:true,
        name:req.body.name
    })
})

//api for getting all the products
app.get("/allproducts",async(req,res)=>{
  let products = await Product.find({});
    console.log("All products fetched");
    res.send(products);
   
})

//Schema creating for user model
const Users = mongoose.model("User",{
  name:{
    type:String,
    
  },
  email:{
    type:String,
    unique:true,
  },
  password:{
    type:String,
  },
  cartData:{
    type:Object,
  },
  date:{
    type:Date,
    default:Date.now(),
  },
})

//creating the endpoint for registering thr user
app.post("/signup",async(req,res)=>{
  let check = await Users.findOne({email:req.body.email});

  if(check){
    return res.status(400).json({success:false,errors:"email already exists."});
  }
  let cart ={};
  for(let i=0;i<300;i++){
    cart[i]=0;
  }
  const user = new Users({
    name:req.body.username,
    email:req.body.email,
    password:req.body.password,
    cartData:cart,
  })

  await user.save();

  const data ={
    user:{
      id:user.id
    }
  }

  const token = jwt.sign(data, "secret_ecom");
  res.json({success:true, token})
})

//creating end point for user login
app.post("/login",async(req,res)=>{
  let user = await Users.findOne({email:req.body.email});
  if(user){
    const passCompare = req.body.password === user.password;
    if(passCompare){
      const data = {
        user:{
          id:user.id
        }
      }
      const token = jwt.sign(data, "secret_ecom");
      res.json({success:true, token})
    }
    else{
       res.json({success:false,errors:"Wrong password."});
    }
  }
  else{
     resjson({success:false,errors:"Wrong email Id."});
  }
})

//creating API for gor new collection data
app.get("/newcollection",async(req,res)=>{
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("new collection fetched");
  res.send(newcollection);
})

//creating API for gor popular in women category data
app.get("/popularinwomen",async(req,res)=>{
  let products = await Product.find({category:"women"});
  let popular_in_women = products.slice(0,4);
  console.log("popular in women fetched");
  res.send(popular_in_women);
})

//creating middleware to fetch the user
const fetchUser = async(req,res,next)=>{
  const token = req.header("auth-token");
  if(!token){
    res.status(401).send({errors:"Please authenticate using valid token"});
  }
  else{
    try {
      const data = jwt.verify(token,"secret_ecom");
      req.user = data.user;
      next();
    } catch (error) {
      res.status(401).send({errors:" Error! Please authenticate using valid token"});
    }
  }
}

//creating API for add poducts in cart data
app.post("/addtocart",fetchUser,async(req,res)=>{
  console.log("Added",req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id});
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("Added cart data");
  
})

//creating API for remove poducts from cart data
app.post("/removefromcart",fetchUser,async(req,res)=>{
  console.log("removed",req.body.itemId);
  let userData = await Users.findOne({_id:req.user.id});
  if(userData.cartData[req.body.itemId] > 0){
    userData.cartData[req.body.itemId] -= 1;
  }
  
  await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
  res.send("removed from cart data");
  
})

//creating API for get  cart data
app.post("/getcart",fetchUser,async(req,res)=>{
  console.log("get Cart ");
  let userData = await Users.findOne({_id:req.user.id});
 
  res.json(userData.cartData);
  
})




// API CREATION   td7aspzDK1BbEfI4   sumit0099k
app.listen(port, (error) => {
  if (!error) {
    console.log("Server running on port ", port);
  } else {
    console.log("Error :", error);
  }
});
