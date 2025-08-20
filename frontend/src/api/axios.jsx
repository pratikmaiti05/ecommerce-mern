import axios from 'axios'
const instance=axios.create({
  baseURL:"https://ecommerce-mern-qqh9.onrender.com", // Update this to your backend URL
  withCredentials:true
})
export default instance
