const userModel=require('../models/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
async function registerHandler(req,res) {
  try {
     const {username,email,password}=req.body
     if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
     const isUser=await userModel.findOne({email})
      if(isUser){
        return res.status(401).json({
          message:'User Already exists'
        })
      }
      const role=email===process.env.ADMIN_EMAIL ? 'admin' : 'user';
      const user=await userModel.create({
        username,
        email,
        password:await bcrypt.hash(password,10),
        role
      })
      const token=jwt.sign({
        id:user._id
      },process.env.JWTSECRET_KEY)
      res.cookie('token', token, {
        httpOnly: true,
        secure: true, // This should be true in production
        sameSite: 'none', // ✅ ADD THIS LINE
        maxAge: 2 * 24 * 60 * 60 * 1000
      });
      res.status(201).json({
        message:`User created as ${role}`,
        user
      })
  } catch (error) {
    console.log(error);
  }
}
async function loginHandler(req,res) {
  const {email,password}=req.body
  if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
  }
  const user=await userModel.findOne({email})
  if(!user){
    return res.status(401).json({
      message:'Invalid User'
    })
  }
  const isPassword=await bcrypt.compare(password,user.password)
  if(!isPassword){
    return res.status(401).json({
      message:'Invalid Password'
    })
  }
  const token=jwt.sign({
    id:user._id
  },process.env.JWTSECRET_KEY)
  res.cookie('token', token, {
    httpOnly: true,
    secure: true, // This should be true in production
    sameSite: 'none', // ✅ ADD THIS LINE
    maxAge: 2 * 24 * 60 * 60 * 1000
  });
  res.status(201).json({
    message:'User loggedin',
    user
  })
}
async function logoutHandler(req,res){
    res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
  });
  return res.status(200).json({ message: 'Logout successful!' });
}
async function toCart(req,res) {
  try {
    const user=await userModel.findOne({email:req.user.email})
    user.cart.push(req.params.id)
    await user.save()
    res.json({
      message:"Product Added"
    })
  } catch (error) {
    console.log(error);
  }
  
}
async function removeFromCart(req,res) {
  try {
    const user=await userModel.findOne({email:req.user.email})
    user.cart.pull(req.params.id)
    await user.save()
    res.json({
      message:"Product Deleted"
    })
  } catch (error) {
    console.log(error);
  }
}
async function cartItems(req,res) {
  const user=await userModel.findOne({email:req.user.email}).populate("cart")
  res.json({
    user
  })
  
}
module.exports={
  registerHandler,
  loginHandler,
  logoutHandler,
  toCart,
  cartItems,
  removeFromCart
}
