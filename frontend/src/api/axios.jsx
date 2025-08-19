import axios from 'axios'
const instance=axios.create({
  baseURL:"https://first-ecommerce-fullstack.onrender.com",
  withCredentials:true
})
export default instance
