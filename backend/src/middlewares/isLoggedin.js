const jwt=require('jsonwebtoken')
const userModel=require('../models/userModel')
async function isLoggedin(req,res,next) {
  const token=req.cookies.token
  if(!token){
    return res.status(401).json({
      message:'Login First'
    })
  }
  try {
    const decoded=jwt.verify(token,process.env.JWTSECRET_KEY)
    const user=await userModel.findOne({
      _id:decoded.id
    })
    req.user=user
    next()
  } catch (error) {
    console.log(error);
    
  }
}
module.exports={isLoggedin}