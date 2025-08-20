import axios from 'axios'
const instance=axios.create({
  baseURL:"https://ecommerce-mern-qqh9.onrender.com",
  withCredentials:true
})
export default instance
