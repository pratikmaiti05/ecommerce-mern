const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
  username:String,
  email:String,
  password:String,
  role:{
    type:String,
    enum:['user','admin'],
    default:'user'
  },
  cart:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"product"
  }],
})
const userModel=mongoose.model('user',userSchema);
module.exports=userModel