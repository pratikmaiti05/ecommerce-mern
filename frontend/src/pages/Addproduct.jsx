import { useEffect, useState } from "react";
import axios from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CATEGORIES = ["Men", "Women", "Kids"];
const SUBCATS = ["Topwear", "Bottomwear", "Winterwear"];
const SIZES = ["S", "M", "L", "XL"];

const AdminProducts = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [sizes, setSizes] = useState([]);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [products, setProducts] = useState([]); // store all products

  // fetch all products
  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/products/getProducts"); // your backend route
      setProducts(data);
      console.log(products);
      
    } catch (err) {
      console.error(err);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleSize = (sz) => {
    if (sizes.includes(sz)) {
      setSizes(sizes.filter((s) => s !== sz));
    } else {
      setSizes([...sizes, sz]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("subCategory", subcategory);
      formData.append("price", price);
      formData.append("size", JSON.stringify(sizes));
      formData.append("image", image);

      await axios.post("/products/addProduct", formData);

      toast.success("Product added!");
      setName("");
      setDescription("");
      setCategory("");
      setSubcategory("");
      setPrice("");
      setSizes([]);
      setImage(null);

      fetchProducts(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await axios.delete(`/products/removeProduct/${id}`); // backend expects req.body.id
      toast.success("Product removed!");
      fetchProducts(); // refresh list
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove product");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Product Form */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-2xl font-semibold mb-6">Add Product</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none"
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            >
              <option value="">Select subcategory</option>
              {SUBCATS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="0"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />

            <div className="flex gap-2 flex-wrap">
              {SIZES.map((sz) => (
                <button
                  type="button"
                  key={sz}
                  onClick={() => toggleSize(sz)}
                  className={`px-3 py-1 rounded border text-sm ${
                    sizes.includes(sz)
                      ? "bg-blue-100 border-blue-400"
                      : "bg-gray-100 border-gray-300"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>

            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800"
            >
              {loading ? "Saving..." : "Add Product"}
            </button>
          </form>
        </div>

        
        {/* Products List */}
<div className="bg-white p-6 rounded-lg shadow-md">
  <h1 className="text-2xl font-semibold mb-6">All Products</h1>
  <div className="space-y-4 max-h-[70vh] overflow-y-auto">
    {products.length > 0 ? (
      products.map((p) => (
        <div
          key={p._id}
          className="flex items-center justify-between border rounded-md p-3 gap-4"
        >
          {/* Product Image */}
          <img
            src={p.image}
            alt={p.name}
            className="w-16 h-16 object-cover rounded-md border"
          />

          {/* Product Info */}
          <div className="flex-1">
            <h2 className="font-medium">{p.name}</h2>
            <p className="text-sm text-gray-600">${p.price}</p>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => handleRemove(p._id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Remove
          </button>
        </div>
      ))
    ) : (
      <p className="text-gray-500">No products found</p>
    )}
  </div>
</div>

      </div>
      <ToastContainer />
    </div>
  );
};

export default AdminProducts;
