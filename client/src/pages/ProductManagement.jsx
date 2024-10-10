import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const ProductManagement = () => {
	const [loading, setLoading] = useState(true);
	const [furnitureData, setFurnitureData] = useState([]); // State for furniture data
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedFurnitureType, setSelectedFurnitureType] = useState("");
	const [categories, setCategories] = useState([]);
	const [filteredFurnitureTypes, setFilteredFurnitureTypes] = useState([]);
	const [filteredSizes, setFilteredSizes] = useState([]);
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

	// console.log("Furniture Data:", furnitureData);

	useEffect(() => {
		const fetchData = async () => {
			const timeout = setTimeout(() => {
				setLoading(true); // Ensure loading is true for at least 60 seconds
			}, 60000); // Set timeout duration to 60 seconds (60000 ms)
			setLoading(true); // Start loading
			try {
				const [
					furnitureResponse,
					furnitureTypesResponse,
					categoriesResponse,
					materialsResponse,
					colorsResponse,
					sizesResponse,
				] = await Promise.all([
					fetch("http://localhost:3000/api/furnitures"),
					fetch("http://localhost:3000/api/furniture-types"),
					fetch("http://localhost:3000/api/categories"),
					fetch("http://localhost:3000/api/materials"),
					fetch("http://localhost:3000/api/colors"),
					fetch("http://localhost:3000/api/sizes"),
				]);
				if (
					!furnitureResponse.ok ||
					!furnitureTypesResponse.ok ||
					!categoriesResponse.ok ||
					!materialsResponse.ok ||
					!colorsResponse.ok ||
					!sizesResponse.ok
				) {
					throw new Error("Failed to fetch some data");
				}
				const furnitureData = await furnitureResponse.json();
				const furnitureTypesData = await furnitureTypesResponse.json();
				const categoriesData = await categoriesResponse.json();
				const materialsData = await materialsResponse.json();
				const colorsData = await colorsResponse.json();
				const sizesData = await sizesResponse.json();
				setFurnitureData(furnitureData.furnitures || []);
				setCategories(categoriesData || []);
				setMaterials(materialsData || []);
				setColors(colorsData || []);
				setSizes(sizesData || []);
				setFurnitureTypes(furnitureTypesData || []);
			} catch (error) {
				console.error("Error fetching data:", error);
				toast.error("Error fetching data");
			} finally {
				clearTimeout(timeout);
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	const fetchFurnitureData = async () => {
		try {
			const response = await fetch("http://localhost:3000/api/furnitures");
			if (!response.ok) {
				throw new Error("Failed to fetch furniture data");
			}
			const data = await response.json();
			setFurnitureData(data.furnitures || []);
		} catch (error) {
			console.error("Error fetching furniture data:", error);
			toast.error("Error fetching furniture data");
		}
	};

	const handleCategoryChange = (e) => {
		const categoryId = e.target.value;
		setSelectedCategory(categoryId);
		setNewFurniture((prev) => ({
			...prev,
			category: categoryId,
			furnitureType: "",
		}));
		setSelectedFurnitureType("");
		const filteredTypes = furnitureTypes.filter(
			(type) => type.categoryId === categoryId
		);
		setFilteredFurnitureTypes(filteredTypes);
	};

	const handleFurnitureTypeChange = (e) => {
		const furnitureTypeId = e.target.value;
		setSelectedFurnitureType(furnitureTypeId);
		setNewFurniture((prev) => ({
			...prev,
			furnitureType: furnitureTypeId,
		}));
		const filtered = sizes.filter(
			(size) => size.furnitureTypeId === furnitureTypeId
		);
		setFilteredSizes(filtered);
	};

	const handleInputChange = (e) => {
		const { name, value, type, checked } = e.target;

				if (name === "price" && value < 0) {
					toast.error("Price cannot be negative");
					return;
			}
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
			} else if (name === "sizes") {
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await fetch("http://localhost:3000/api/furnitures/add", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					image: newFurniture.image,
					name: newFurniture.name,
					category: newFurniture.category,
					furnitureType: newFurniture.furnitureType,
					description: newFurniture.description,
					materials: newFurniture.materials,
					colors: newFurniture.colors,
					sizes: newFurniture.sizes,
					stocks: newFurniture.stocks,
					price: newFurniture.price,
				}),
			});
			if (response.ok) {
				const data = await response.json();
				toast.success(data.message);
				setNewFurniture({
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
				await fetchFurnitureData(); // Refresh furniture data
			} else {
				const errorData = await response.json();
				toast.error(errorData.message);
			}
		} catch (error) {
			console.error("Error adding new Furniture:", error);
			toast.error("Failed to add new Furniture");
		}
	};

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-3xl font-bold mb-6 text-center">
				Product Management
			</h1>
			{loading ? (
				<div className="flex justify-center items-center h-64">
					<ClipLoader loading={loading} size={50} color="#007bff" />
				</div>
			) : (
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
							{filteredFurnitureTypes.map((furnitureType) => (
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
							min="0" // Ensure price cannot be negative
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
						<div className="mt-4 mb-4  bg-slate-200 rounded-md px-5 py-2">
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
						<div className="mb-4  bg-slate-200 rounded-md p-2">
							<label className="block font-semibold">Colors:</label>
              <div className="flex flex-wrap gap-4">
                  {colors.map((color) => (
                    <label key={color._id} className="flex items-center w-1/4">
                      {" "}
                      <input
                        type="checkbox"
                        name="color"
                        value={color.name}
                        checked={newFurniture.colors.includes(color.name)}
                        onChange={handleInputChange}
                        className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700 mr-5">
                        {color.name.charAt(0).toUpperCase() +
                          color.name.slice(1)}
                      </span>
                      <div
                        className="mr-2 h-4 w-4 border rounded"
                        style={{ backgroundColor: color.hex }}
                      />
                    </label>
                  ))}
                </div>
						</div>
						<div className="mb-4 bg-slate-200 rounded-md p-2">
							<label className="block font-semibold my-2 mb-2">
								Sizes: (Height X Width X Length X Depth){" "}
							</label>
							<div className="flex flex-wrap gap-4">
								{filteredSizes.length > 0 ? (
									filteredSizes.map((size) => (
										<label key={size._id} className="flex items-center">
											<input
												type="checkbox"
												name="sizes"
												value={size.label}
												checked={newFurniture.sizes.includes(size.label)}
												onChange={handleInputChange}
												className="mr-2 h-4 w-4 border rounded text-blue-600 focus:ring-blue-500"
											/>
											<span className="text-gray-700">
												{size.label.charAt(0).toUpperCase() +
													size.label.slice(1)}{" "}
												<span className="text-gray-500 italic">
													( {size.height} X {size.width} X {size.length} X{" "}
													{size.depth} )
												</span>
											</span>
										</label>
									))
								) : (
									<p className="text-gray-500">No sizes available</p>
								)}
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
			)}
			{/* Table to display furniture data */}
			<div className="mt-8">
				<h2 className="text-2xl font-bold mb-4">Furniture List</h2>
				<table className="min-w-full border-collapse border border-gray-200">
					<thead>
						<tr className="bg-gray-100">
						<th className="border border-gray-300 p-2">Furniture Id</th>
							<th className="border border-gray-300 p-2">Image</th>
							<th className="border border-gray-300 p-2">Name</th>
							<th className="border border-gray-300 p-2">Category</th>
							<th className="border border-gray-300 p-2">Description</th>
							<th className="border border-gray-300 p-2">Type</th>
							<th className="border border-gray-300 p-2">Sizes</th>
							<th className="border border-gray-300 p-2">Materials</th>
							<th className="border border-gray-300 p-2">Price</th>
							<th className="border border-gray-300 p-2">Stocks</th>
							<th className="border border-gray-300 p-2">Actions</th>
						</tr>
					</thead>
					<tbody>
    {furnitureData.length > 0 ? (
        furnitureData.map((furniture) => (
            <tr key={furniture._id}>
                <td className="border border-gray-300 p-2">{furniture._id}</td>
                <td className="border border-gray-300 p-2">
                    <img
                        src={`data:image/jpeg;base64,${furniture.image}`}
                        alt={furniture.name}
                        className="w-16 h-16 object-cover"
                    />
                </td>
                <td className="border border-gray-300 p-2">{furniture.name}</td>
                <td className="border border-gray-300 p-2">{furniture.category?.name || "N/A"}</td>
                <td className="border border-gray-300 p-2">{furniture.description}</td>
                <td className="border border-gray-300 p-2">{furniture.furnitureType?.name}</td>
                <td className="border border-gray-300 p-2">
                    {furniture.sizes && furniture.sizes.length > 0
                        ? furniture.sizes.map(size => (
                            <span key={size._id} className="block">
                                {size.label} ( {size.height} X {size.width} X {size.length} X {size.depth} )
                            </span>
                        ))
                        : "N/A"}
                </td>
                <td className="border border-gray-300 p-2">
                    {furniture.materials && furniture.materials.length > 0
                        ? furniture.materials.map(material => (
                            <span key={material._id} className="block">
                                {material.name}
                            </span>
                        ))
                        : "N/A"}
                </td>
                <td className="border border-gray-300 p-2">{furniture.price}</td>
                <td className="border border-gray-300 p-2">{furniture.stocks.stocks || "N/A"}</td>
                <td className="border border-gray-300 p-2 flex space-x-2">
                    <button
                        onClick={() => handleEdit(furniture._id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleArchive(furniture._id)}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                        Archive
                    </button>
                </td>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="10" className="text-center p-4">
                No furniture available
            </td>
        </tr>
    )}
</tbody>

				</table>
			</div>
			<ToastContainer />
		</div>
	);
};

export default ProductManagement;
