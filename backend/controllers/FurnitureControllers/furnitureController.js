const Furniture = require("../../models/Furniture/furnitureModel");
const Category = require("../../models/Furniture/categoryModel");
const multer = require("multer");
const mongoose = require('mongoose');
const FurnitureType = require("../../models/Furniture/furnitureTypeModel");
const Materials = require("../../models/Furniture/materialsModel");
const Colors = require("../../models/Furniture/colorModel");
const Size = require("../../models/Furniture/sizeModel");
const Stocks = require("../../models/Furniture/stocksModel");

// Multer setup for handling image uploads in memory
const upload = multer({ storage: multer.memoryStorage() }).single("image"); // Accept only one image

// Get all furnitures or furniture by ID
exports.getAllFurnitures = async (req, res) => {
    try {
        const furnitures = await Furniture.find({ isArchived: false }).populate([
            { path: "category", select: "name -_id" },
            { path: "furnitureType", select: "name -_id" },
            { path: "materials", select: "name -_id" },
            { path: "colors", select: "name -_id" },
            { path: "stocks", select: "stocks -_id" },
            { path: "sizes", select: "label -_id" },
        ]);
        if (furnitures.length === 0)
            return res.status(404).json({ message: "No furnitures found!" });
        res.status(200).json(furnitures);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error!" });
    }
};

exports.ArchivedFurnitures = async (req, res) => {
	try {
			const archivedFurnitures = await Furniture.find({ isArchived: true }).populate([
					{ path: "category", select: "name -_id" },
					{ path: "furnitureType", select: "name -_id" },
					{ path: "materials", select: "name -_id" },
					{ path: "colors", select: "name -_id" },
					{ path: "stocks", select: "stocks -_id" },
					{ path: "sizes", select: "label -_id" },
			]);

			if (archivedFurnitures.length === 0) {
					return res.status(404).json({ message: "No archived furnitures found!" });
			}

			res.status(200).json(archivedFurnitures);
	} catch (error) {
			console.error("Error displaying archived furnitures: ", error);
			res.status(500).json({ message: "Server error!" });
	}
};

// Get Furniture By ID
exports.getFurnitureById = async (req, res) => {
	try {
		const { furnitureId } = req.params;
		const furniture = await Furniture.findById(furnitureId).populate([
			{ path: "category", select: "name -_id" },
			{ path: "furnitureType", select: "name -_id" },
			{ path: "materials", select: "name -_id" },
			{ path: "colors", select: "name -_id" },
			{ path: "stocks", select: "stocks -_id" },
			{ path: "sizes", select: "label -_id" },
		]);

		if (!furniture) {
			return res.status(404).json({ message: "Furniture not found!" });
		}

		res.status(200).json(furniture);
	} catch (error) {
		console.error("Error in finding furniture by ID: ", error);
		res.status(500).json({ message: "Server error!" });
	}
};
// Create Furniture
exports.createFurniture = [
	upload, // Use the updated multer configuration
	async (req, res) => {
			try {
					let image; // Initialize image variable
					if (req.file) {
							image = req.file.buffer.toString("base64"); // Convert the image to base64
					} else if (req.body.image) {
							// Ensure the image field is parsed correctly
							image = req.body.image;
					} else {
							return res.status(400).json({ message: "No image provided!" });
					}

					const {
							category,
							furnitureType,
							name,
							description,
							stocks,
							materials,
							colors,
							sizes,
							price,
					} = req.body;

					// Validation
					let missingFields = [];
					if (!category) missingFields.push("category");
					if (!furnitureType) missingFields.push("furnitureType");
					if (!description) missingFields.push("description");
					if (!name) missingFields.push("name");
					if (!materials) missingFields.push("materials");
					if (!colors) missingFields.push("colors");
					if (!stocks) missingFields.push("stocks");
					if (!price) missingFields.push("price");
					if (!sizes) missingFields.push("sizes");
					if (missingFields.length > 0) {
							return res.status(400).json({
									message: `The following fields are required: ${missingFields.join(", ")}`,
							});
					}

					// Find the category, furniture type, materials, and colors by name
					const existingCategory = await Category.findOne({ name: category });
					const existingFurnitureType = await FurnitureType.findOne({
							name: furnitureType,
					});
					const existingMaterials = await Materials.find({
							name: { $in: materials },
					});
					const existingColors = await Colors.find({ name: { $in: colors } });
					const existingName = await Furniture.findOne({ name });
					const existingSize = await Size.find({
							label: { $in: sizes },
							furnitureTypeId: existingFurnitureType._id,
					});

					if (existingName) {
							return res.status(400).json({ message: "Furniture name already exists!" });
					}

					// Error handling for missing items
					if (!existingCategory)
							return res.status(400).json({ message: "Invalid category!" });
					if (!existingFurnitureType)
							return res.status(400).json({ message: "Invalid furniture type!" });
					if (existingMaterials.length !== materials.length)
							return res.status(400).json({ message: "Some materials are invalid!" });
					if (existingColors.length !== colors.length)
							return res.status(400).json({ message: "Some colors are invalid!" });
					// Check if the correct number of sizes were found
					if (existingSize.length !== sizes.length) {
							return res.status(400).json({
									message: `Some sizes are invalid for ${existingFurnitureType.name}. Please ensure all sizes are correct.`,
							});
					}

					const newStock = new Stocks({ stocks });
					await newStock.save();

					// Create a new furniture item
					const newFurniture = new Furniture({
							image, // Storing the base64 string directly
							category: existingCategory._id,
							furnitureType: existingFurnitureType._id,
							name,
							description,
							stocks: newStock._id,
							materials: existingMaterials.map((material) => material._id),
							colors: existingColors.map((color) => color._id),
							sizes: existingSize.map((size) => size._id),
							price,
					});

					await newFurniture.save();
					res.status(201).json({
							message: "New furniture is added successfully!",
							furniture: newFurniture,
					});
			} catch (error) {
					console.error(error);
					res.status(500).json({ message: "Server error!", error: error.message });
			}
	},
];

// Update Furniture
exports.updateFurniture = [
	upload, // Use the updated multer configuration
	async (req, res) => {
			try {
					const { furnitureId } = req.params;
					const furniture = await Furniture.findById(furnitureId);
					if (!furniture) {
							return res.status(404).json({ message: "Furniture not found!" });
					}

					let images = furniture.images; // Preserve existing images
					if (req.files && req.files.length > 0) {
							images = req.files.map((file) => file.buffer.toString("base64")); // Convert each new image to base64
					} else if (req.body.images) {
							if (Array.isArray(req.body.images)) {
									images = req.body.images; // Use provided images if they are in the correct format
							} else {
									return res.status(400).json({ message: "Images must be an array!" });
							}
					}

					const {
							category,
							furnitureType,
							name,
							description,
							stocks,
							materials,
							colors,
							sizes,
							price,
					} = req.body;

					// Find the category, furniture type, materials, and colors by name
					if (category) {
							const existingCategory = await Category.findOne({ name: category });
							if (existingCategory) {
									furniture.category = existingCategory._id;
							} else {
									return res.status(400).json({ message: "Invalid category!" });
							}
					}

					if (furnitureType) {
							const existingFurnitureType = await FurnitureType.findOne({ name: furnitureType });
							if (existingFurnitureType) {
									furniture.furnitureType = existingFurnitureType._id;
							} else {
									return res.status(400).json({ message: "Invalid furniture type!" });
							}
					}

					if (materials) {
							const existingMaterials = await Materials.find({ name: { $in: materials } });
							if (existingMaterials.length !== materials.length) {
									return res.status(400).json({ message: "Some materials are invalid!" });
							}
							furniture.materials = existingMaterials.map((material) => material._id);
					}

					if (colors) {
							const existingColors = await Colors.find({ name: { $in: colors } });
							if (existingColors.length !== colors.length) {
									return res.status(400).json({ message: "Some colors are invalid!" });
							}
							furniture.colors = existingColors.map((color) => color._id);
					}

					if (sizes) {
							const existingSize = await Size.find({ label: { $in: sizes }, furnitureTypeId: furniture.furnitureType });
							if (existingSize.length !== sizes.length) {
									return res.status(400).json({
											message: `Some sizes are invalid for the given furniture type. Please ensure all sizes are correct.`,
									});
							}
							furniture.sizes = existingSize.map((size) => size._id);
					}

					// Update other properties
					furniture.images = images;
					furniture.name = name || furniture.name; // Only update if provided
					furniture.description = description || furniture.description; // Only update if provided
					furniture.price = price || furniture.price; // Only update if provided
					furniture.stocks = stocks ? stocks._id : furniture.stocks; // Only update if stocks are provided

					await furniture.save();
					res.status(200).json({
							message: "Furniture updated successfully!",
							furniture,
					});
			} catch (error) {
					console.error(error);
					res.status(500).json({ message: "Server error!", error: error.message });
			}
	},
];

//archieving furniture
exports.Archived = async (req, res) => {
	try {
			const { furnitureId } = req.params;

			// Validate ObjectId
			if (!mongoose.Types.ObjectId.isValid(furnitureId)) {
					return res.status(400).json({ message: "Invalid furniture ID!" });
			}

			const furniture = await Furniture.findById(furnitureId);
			if (!furniture) {
					return res.status(404).json({ message: "Furniture not found!" });
			}

			furniture.isArchived = true;
			await furniture.save();
			res.status(200).json({ message: `${furniture.name} has been archived successfully!` });
	} catch (error) {
			console.error("Error archiving the furniture: ", error);
			res.status(500).json({ message: "Server error!" });
	}
};

exports.UnArchived = async (req, res) => {
	try {
			const { furnitureId } = req.params;

			// Validate ObjectId
			if (!mongoose.Types.ObjectId.isValid(furnitureId)) {
					return res.status(400).json({ message: "Invalid furniture ID!" });
			}

			const furniture = await Furniture.findById(furnitureId);
			if (!furniture) {
				return res.status(404).json({ message: "Furniture not found!" });
			}

			if(furniture.isArchived){
				furniture.isArchived = false;
			}

			await furniture.save();
			res.status(200).json({ message: `${furniture.name} has been unarchived successfully!` });
	} catch (error) {
			console.error("Error archiving the furniture: ", error);
			res.status(500).json({ message: "Server error!" });
	}
};