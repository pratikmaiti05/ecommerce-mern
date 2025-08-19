const express=require('express')
const router=express.Router()
const productModel=require('../models/productModel')
const multer=require('multer')
const uploadFile = require('../service/storageService')
const isAdmin = require('../middlewares/isAdmin')
const { isLoggedin } = require('../middlewares/isLoggedin')
const upload=multer({storage:multer.memoryStorage()});
router.post('/addProduct',upload.single('image'),isLoggedin,isAdmin,async (req,res) => {
  try {
    const image = await uploadFile(req.file);
    let{name,price,category,subCategory,description,size}=req.body
    const products=await productModel.create({
      image:image.url,
      name,price,category,subCategory,description,size:size[0]
    })
    res.status(201).json({
      message: "Product added successfully",
      products:products
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({message: "Error adding product"});
  }
})
router.get('/getProducts', async (req, res) => {
  try {
    const products = await productModel.find();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching products" });
  }
});
router.get('/getProduct/:id', async (req, res) => {
  try {
    const id=req.params.id
    const product = await productModel.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching product" });
  }
});
router.delete('/removeProduct/:id', async (req, res) => {
  try {
    const {id}  = req.params 
    if (!id) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    const product = await productModel.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product removed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing product" });
  }
});

module.exports=router