import React, { useState, useEffect } from "react";
import axios from "axios";

const ProductManagement = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [colors, setColors] = useState([]);
    const [furnitureTypes, setFurnitureTypes] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [sizes, setSizes] = useState([]);
    const [filteredFurnitureTypes, setFilteredFurnitureTypes] = useState([]);
    const [newProduct, setNewProduct] = useState({
        image: null,
        category: "",
        furnitureType: "",
        name: "",
        description: "",
        price: "",
        color: [],
        material: [],
        stocks: "",
        selectedSize: "",
    });
    
    // Page navigation
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage] = useState(5);
    const [filterCategory, setFilterCategory] = useState("");
    const [filterType, setFilterType] = useState("");
    const [sortOrder, setSortOrder] = useState("newest");

    // Fetch functions
    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            alert("Failed to fetch categories. Please try again.");
        }
    };
    const fetchProducts = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/furnitures");
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            alert("Failed to fetch products. Please try again.");
        }
    };
    const fetchColors = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/colors");
            setColors(response.data);
        } catch (error) {
            console.error("Error fetching colors:", error);
            alert("Failed to fetch colors. Please try again.");
        }
    };
    const fetchFurnitureTypes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/furniture-types");
            setFurnitureTypes(response.data);
        } catch (error) {
            console.error("Error fetching furniture types:", error);
            alert("Failed to fetch furniture types. Please try again.");
        }
    };
    const fetchMaterials = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/materials");
            setMaterials(response.data);
        } catch (error) {
            console.error("Error fetching materials:", error);
            alert("Failed to fetch materials. Please try again.");
        }
    };
    const fetchSizes = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/sizes");
            setSizes(response.data);
        } catch (error) {
            console.error("Error fetching sizes:", error);
            alert("Failed to fetch sizes. Please try again.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchCategories(),
                    fetchProducts(),
                    fetchColors(),
                    fetchFurnitureTypes(),
                    fetchMaterials(),
                    fetchSizes(),
                ]);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Filter furniture types based on category
    useEffect(() => {
        if (newProduct.category) {
            const selectedCategory = categories.find(category => category.name === newProduct.category);
            if (selectedCategory) {
                const filteredTypes = furnitureTypes.filter(type => type.categoryId === selectedCategory._id);
                setFilteredFurnitureTypes(filteredTypes);
            } else {
                setFilteredFurnitureTypes([]);
            }
        } else {
            setFilteredFurnitureTypes([]);
        }
    }, [newProduct.category, furnitureTypes, categories]);

    const handleInputChange = (e) => {
        const { name, value, files } = e.target;
        setNewProduct((prevData) => ({
            ...prevData,
            [name]: files ? files[0] : value,
        }));
    };

    const handleCheckboxChange = (e, type) => {
        const { name, checked } = e.target;
        if (checked) {
            setNewProduct((prevData) => ({
                ...prevData,
                [type]: [...prevData[type], name],
            }));
        } else {
            setNewProduct((prevData) => ({
                ...prevData,
                [type]: prevData[type].filter((item) => item !== name),
            }));
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/api/furnitures/furniture/${id}`);
            setProducts(products.filter((product) => product._id !== id));
            alert("Product deleted successfully.");
        } catch (error) {
            console.error("Error deleting product:", error);
            alert("Failed to delete the product. Please try again.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const form = new FormData();
        form.append("image", newProduct.image);
        form.append("category", newProduct.category);
        form.append("furnitureType", newProduct.furnitureType);
        form.append("name", newProduct.name);
        form.append("description", newProduct.description);
        form.append("price", newProduct.price);
        form.append("color", JSON.stringify(newProduct.color)); // Handle multiple colors
        form.append("material", JSON.stringify(newProduct.material)); // Handle multiple materials
        form.append("stocks", newProduct.stocks);
        form.append("selectedSize", newProduct.selectedSize);
        try {
            const response = await axios.post("http://localhost:3000/api/furnitures/add", form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            alert(`${response.data.furniture.name} has been added successfully!`);
            fetchProducts();
            setNewProduct({
                image: null,
                category: "",
                furnitureType: "",
                name: "",
                description: "",
                price: "",
                color: [],
                material: [],
                stocks: "",
                selectedSize: "",
            });
        } catch (error) {
            console.error("Error creating furniture!", error.response?.data || error.message);
            alert(error.response?.data?.message || error.message || "Cannot add furniture!");
        }
    };

    // Filtering logic based on category and type
    const filteredProducts = products.filter((product) => {
        return (
            (!filterCategory || product.category === filterCategory) &&
            (!filterType || product.furnitureType === filterType)
        );
    });

    // Sorting logic based on the created date
    const sortedProducts = filteredProducts.sort((a, b) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.max(Math.ceil(sortedProducts.length / productsPerPage), 1);

    return (
        <div className="container mx-auto p-2">
            <h1 className="text-3xl font-bold mb-2 text-center">Product Management</h1>
            {/* Filter and Sort Section */}
            <div className="mb-2 flex gap-4 justify-end">
                <select
                    name="filterCategory"
                    onChange={(e) => setFilterCategory(e.target.value)}
                    value={filterCategory}
                    className="bg-gray-100 p-2 rounded-lg border border-gray-300"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                            {category.name}
                        </option>
                    ))}
                </select>
                <select
                    name="filterType"
                    onChange={(e) => setFilterType(e.target.value)}
                    value={filterType}
                    className="bg-gray-100 p-2 rounded-lg border border-gray-300"
                >
                    <option value="">All Types</option>
                    {furnitureTypes.map((type) => (
                        <option key={type._id} value={type.name}>
                            {type.name}
                        </option>
                    ))}
                </select>
                {/* Sort by Date Dropdown */}
                <select
                    name="sortOrder"
                    onChange={(e) => setSortOrder(e.target.value)}
                    value={sortOrder}
                    className="bg-gray-100 p-3 rounded-lg border border-gray-300"
                >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                </select>
            </div>
            <div className="flex gap-6">
                {/* Product Form Section */}
                <div className="w-full md:w-1/3 bg-white p-6 rounded-lg shadow-lg flex flex-col h-full">
                    <form onSubmit={handleSubmit} className="space-y-6 flex-grow">
                        {/* Category Dropdown */}
                        <select
                            name="category"
                            onChange={handleInputChange}
                            value={newProduct.category}
                            className="bg-gray-100 p-3 rounded-lg w-full border border-gray-300"
                            required
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category.name}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {/* Furniture Type Dropdown */}
                        <select
                            name="furnitureType"
                            value={newProduct.furnitureType}
                            onChange={handleInputChange}
                            className="bg-gray-100 p-3 rounded-lg w-full border border-gray-300"
                            required
                        >
                            <option value="">Select Furniture Type</option>
                            {filteredFurnitureTypes.map((type) => (
                                <option key={type._id} value={type.name}>
                                    {type.name}
                                </option>
                            ))}
                        </select>
                        {/* Other Input Fields */}
                        <input
                            type="text"
                            name="name"
                            placeholder="Product Name"
                            value={newProduct.name}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                            required
                        />
                        <textarea
                            name="description"
                            placeholder="Description"
                            value={newProduct.description}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                            required
                        />
                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={newProduct.price}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                            required
                        />
                        {/* Color Checkboxes */}
                        <div className="relative">
                            <h3 className="font-semibold">Select Colors</h3>
                            {colors.map((color) => (
                                <label key={color._id} className="flex items-center p-2">
                                    <input
                                        type="checkbox"
                                        name={color.name}
                                        checked={newProduct.color.includes(color.name)}
                                        onChange={(e) => handleCheckboxChange(e, "color")}
                                        className="mr-2"
                                    />
                                    {color.name}
                                </label>
                            ))}
                        </div>
                        {/* Material Checkboxes */}
                        <div className="relative">
                            <h3 className="font-semibold">Select Materials</h3>
                            {materials.map((material) => (
                                <label key={material._id} className="flex items-center p-2">
                                    <input
                                        type="checkbox"
                                        name={material.name}
                                        checked={newProduct.material.includes(material.name)}
                                        onChange={(e) => handleCheckboxChange(e, "material")}
                                        className="mr-2"
                                    />
                                    {material.name}
                                </label>
                            ))}
                        </div>
                        <input
                            type="number"
                            name="stocks"
                            placeholder="Available Stocks"
                            value={newProduct.stocks}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                            required
                        />
                        {/* Furniture Sizes */}
                        <select
                            name="selectedSize"
                            value={newProduct.selectedSize}
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                            required
                        >
                            <option value="">Select Furniture Size</option>
                            {sizes.map((size) => (
                                <option key={size._id} value={size.label}>
                                    {size.label}
                                </option>
                            ))}
                        </select>
                        <input
                            type="file"
                            name="image"
                            id="image"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="w-full p-3 bg-gray-100 rounded-lg border border-gray-300"
                            required
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-3 rounded-lg w-full"
                        >
                            Add Product
                        </button>
                    </form>
                </div>
                <div className="w-full md:w-2/3 h-1/2 overflow-y-auto">
                    {currentProducts.length > 0 ? (
                        <table className="min-w-full bg-white border border-black">
                            <thead>
                                <tr>
                                    <th className="px-2 py-2 border-b border-r border-black">Image</th>
                                    <th className="px-2 py-2 border-b border-r border-black">Product Name</th>
                                    <th className="px-2 py-2 border-b border-r border-black">Category</th>
                                    <th className="px-2 py-2 border-b border-r border-black">Furniture Type</th>
                                    <th className="px-2 py-2 border-b border-r border-black">Description</th>
                                    <th className="px-2 py-2 border-b border-r border-black">Price</th>
                                    <th className="px-2 py-2 border-b border-r border-black">Color</th>
                                    <th className="px-2 py-2 border-b border-r border-black">Material</th>
                                    <th className="px-2 py-2 border-b border-r border-black">Stocks</th>
                                    <th className="px-2 py-2 border-b border-r border-black">Size</th>
                                    <th className="px-2 py-2 border-b border-r border-black">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((product) => (
                                    <tr key={product._id} className="border-b">
                                        <td className="px-2 py-2">
                                            {product.image ? (
                                                <img
                                                    src={`data:image/png;base64,${product.image}`}
                                                    alt={product.name}
                                                    className="w-16 h-16 object-cover rounded-lg"
                                                />
                                            ) : (
                                                <span>No Image</span>
                                            )}
                                        </td>
                                        <td className="px-2 py-2 text-center">{product.name}</td>
                                        <td className="px-2 py-2 text-center">{product.category?.name}</td>
                                        <td className="px-2 py-2 text-center">{product.furnitureType?.name}</td>
                                        <td className="px-2 py-2 text-center">{product.description}</td>
                                        <td className="px-2 py-2 text-center">₱{product.price}</td>
                                        <td className="px-2 py-2 text-center">{product.color.join(", ")}</td>
                                        <td className="px-2 py-2 text-center">{product.material.join(", ")}</td>
                                        <td className="px-2 py-2 text-center">{product.stocks}</td>
                                        <td className="px-2 py-2 text-center">{product.selectedSize || "N/A"}</td>
                                        <td className="px-2 py-2 text-center">
                                            <button
                                                onClick={() => handleDelete(product._id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="text-center text-gray-600">No products found.</p>
                    )}
                    {/* Pagination Controls */}
                    <div className="flex justify-center mt-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg mr-2"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">
                            {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg ml-2"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManagement;