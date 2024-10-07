import React, { useEffect, useState } from "react";

const ProductManagement = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedFurnitureType, setSelectedFurnitureType] = useState("");
  const [categories, setCategories] = useState([]);
  const [furnitureTypes, setFurnitureTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  const [newFurniture, setNewFurniture] = useState({
    image: "",
    name: "",
    category: "",
    furnitureType: "",
    description: "",
    materials: [],
    colors: [],
    sizes: [],
    stocks: "",
    price: "",
  });

  useEffect(() => {
    // Fetch categories, materials, colors, and sizes data
    const fetchFurnitureData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/furnitures");
        if (!response.ok) {
          throw new Error("Failed to fetch furniture data");
        }
        const data = await response.json();

        // Set the fetched data into state variables
        setCategories(data.categories || []);
        setMaterials(data.materials || []);
        setColors(data.colors || []);
        setSizes(data.sizes || []);
      } catch (error) {
        console.error("Error fetching furniture data:", error);
      }
    };

    // Fetch furniture types separately from the different endpoint
    const fetchFurnitureTypes = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/furniture-types");
        if (!response.ok) {
          throw new Error("Failed to fetch furniture types");
        }
        const data = await response.json();

        // Set the fetched furniture types into state
        setFurnitureTypes(data || []);
      } catch (error) {
        console.error("Error fetching furniture types:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        // Set the fetched furniture types into state
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories types:", error);
      }
    };

		const fetchMaterials = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/materials");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        // Set the fetched furniture types into state
        setMaterials(data || []);
      } catch (error) {
        console.error("Error fetching categories types:", error);
      }
    };
		const fetchColors = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/colors");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();

        // Set the fetched furniture types into state
        setColors(data || []);
      } catch (error) {
        console.error("Error fetching categories types:", error);
      }
    };

    fetchFurnitureData();
    fetchFurnitureTypes(); // Fetch furniture types
		fetchCategories();
		fetchMaterials();
		fetchColors();
  }, []);

  const handleCategoryChange = (e) => {
    const categoryId = e.target.value;
    setSelectedCategory(categoryId);
    setNewFurniture((prev) => ({
      ...prev,
      category: categoryId,
      furnitureType: "",
    }));
    setSelectedFurnitureType("");
  };

  const handleFurnitureTypeChange = (e) => {
    const furnitureTypeId = e.target.value;
    setSelectedFurnitureType(furnitureTypeId);
    setNewFurniture((prev) => ({
      ...prev,
      furnitureType: furnitureTypeId,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      if (name === "material") {
        setNewFurniture((prev) => ({
          ...prev,
          materials: checked
            ? [...prev.materials, value]
            : prev.materials.filter((material) => material !== value),
        }));
      } else if (name === "color") {
        setNewFurniture((prev) => ({
          ...prev,
          colors: checked
            ? [...prev.colors, value]
            : prev.colors.filter((color) => color !== value),
        }));
      } else if (name === "size") {
        setNewFurniture((prev) => ({
          ...prev,
          sizes: checked
            ? [...prev.sizes, value]
            : prev.sizes.filter((size) => size !== value),
        }));
      }
    } else {
      setNewFurniture((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewFurniture((prev) => ({
          ...prev,
          image: reader.result.split(",")[1],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", newFurniture);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Product Management
      </h1>
      <div className="flex flex-row justify-center">
        <form onSubmit={handleSubmit} className="mb-6 space-y-4 w-1/2">
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Product Name"
            value={newFurniture.name}
            onChange={handleInputChange}
            required
            className="border rounded p-2 w-full"
          />

          <select
            id="category"
            name="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            required
            className="border rounded p-2 w-full"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            id="furnitureType"
            name="furnitureType"
            value={selectedFurnitureType}
            onChange={handleFurnitureTypeChange}
            required
            className="border rounded p-2 w-full"
          >
            <option value="">Select Type</option>
            {furnitureTypes.map((furnitureType) => (
              <option key={furnitureType._id} value={furnitureType._id}>
                {furnitureType.name}
              </option>
            ))}
          </select>

          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={newFurniture.description}
            onChange={handleInputChange}
            required
            className="border rounded p-2 w-full"
          />

          <input
            id="price"
            type="number"
            name="price"
            placeholder="Price"
            value={newFurniture.price}
            onChange={handleInputChange}
            required
            className="border rounded p-2 w-full"
          />

          <input
            id="stocks"
            type="number"
            name="stocks"
            placeholder="Available Stocks"
            value={newFurniture.stocks}
            onChange={handleInputChange}
            required
            className="border rounded p-2 w-full"
          />

          <div className="mb-4">
            <label className="block font-semibold">Materials:</label>
            <div className="flex flex-col space-y-2">
              {materials.map((material) => (
                <label key={material._id} className="flex items-center">
                  <input
                    type="checkbox"
                    name="material"
                    value={material.name}
                    checked={newFurniture.materials.includes(material.name)}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">
                    {material.name.charAt(0).toUpperCase() +
                      material.name.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Colors:</label>
            <div className="flex flex-col space-y-2">
              {colors.map((color) => (
                <label key={color._id} className="flex items-center">
                  <input
                    type="checkbox"
                    name="color"
                    value={color.name}
                    checked={newFurniture.colors.includes(color.name)}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">
                    {color.name.charAt(0).toUpperCase() + color.name.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block font-semibold">Sizes:</label>
            <div className="flex flex-col space-y-2">
              {sizes.map((size) => (
                <label key={size._id} className="flex items-center">
                  <input
                    type="checkbox"
                    name="size"
                    value={size.label}
                    checked={newFurniture.sizes.includes(size.label)}
                    onChange={handleInputChange}
                    className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">
                    {size.label.charAt(0).toUpperCase() + size.label.slice(1)}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <input
            id="image"
            type="file"
            name="image"
            onChange={handleFileChange}
            required
            className="border rounded p-2 w-full"
          />

          <button
            type="submit"
            className="bg-blue-500 text-white p-2 rounded w-full"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductManagement;
