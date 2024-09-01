const Furniture = require("../models/furnitureModel");
const { FurnitureSchemaValidator } = require("../middlewares/JoiSchemaValidation");
const multer = require('multer');

// Multer setup for handling image uploads in memory
const upload = multer({ storage: multer.memoryStorage() });


// Get all furnitures
exports.getAllFurnitures = async (req, res) => {
	try {
		const furnitures = await Furniture.find();
		if(furnitures.length === 0){
			return res.status(404).json({message:"No furniture found!"})
		}
		res.status(200).json(furnitures);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};

// Create furniture
exports.createFurniture = [upload.single('image'), async (req, res) => {
	try {
    let image;

    if (req.file) {
      image = req.file.buffer.toString('base64');

    } else if (req.body.image) {
      image = req.body.image;
    } else {

      return res.status(400).json({ message: 'No image provided!' });
    }

			const { category, furnitureType, description, price } = req.body;

			let missingFields = [];

			if (!category) missingFields.push("category");
			if (!furnitureType) missingFields.push("furnitureType");
			if (!description) missingFields.push("description");
			if (!price) missingFields.push("price");

			if (missingFields.length > 0) {
				return res.status(400).json({
					message: `The following fields are required: ${missingFields.join(", ")}`
				});
			}

			const newFurniture = new Furniture({
				image,
				category,
				furnitureType,
				description,
				price,
			});

			await newFurniture.save();
			res.status(201).json({
				message: 'New furniture is added successfully!',
				furniture: newFurniture,
			});
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: 'Server error!', error: error.message });
		}
	},
];

// Get furniture by ID
exports.getFurnitureById = async (req, res) => {
	try {
		const { id } = req.params;
		const existingFurniture = await Furniture.findById(id);

		if (!existingFurniture) {
			return res.status(404).json({ message: "Furniture not found!" });
		}

		res.status(200).json(existingFurniture);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};

// Get furniture by category
exports.getFurnitureByCategory = async (req, res) => {
	try {
		const { category } = req.params;

		if (
			!["door", "bed frame", "cabinet", "chair", "table", "sala set"].includes(
				category
			)
		) {
			return res.status(400).json({ message: "Invalid category!" });
		}

		const furniture = await Furniture.find({ category });

		if (!furniture.length) {
			return res
				.status(404)
				.json({ message: "No furniture found for this category!" });
		}

		res.status(200).json(furniture);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};

// Edit furniture by ID
exports.editFurnitureById = async (req, res) => {
	try {
		const { id } = req.params;
		const { image, category, furnitureType, description, price } = req.body;

		const existingFurniture = await Furniture.findById(id);

		if (!existingFurniture) {
			return res.status(404).json({ message: "Furniture not found!" });
		}

		if (image) existingFurniture.image = image;
		if (category) existingFurniture.category = category;
		if (furnitureType) existingFurniture.furnitureType = furnitureType;
		if (description) existingFurniture.description = description;
		if (price) existingFurniture.price = price;

		existingFurniture.updatedAt = new Date();

		const { error } = FurnitureSchemaValidator.validate({
			image,
			category,
			furnitureType,
			description,
			price,
		});

		if (error) {
			return res.status(400).json({ message: error.details[0].message });
		}

		const modifiedFurniture = await existingFurniture.save();

		res.status(200).json({
			message: `Changes have been saved!`,
			furniture: modifiedFurniture,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};

// Delete furniture by ID
exports.deleteFurnitureById = async (req, res) => {
	try {
		const { id } = req.params;

		const existingFurniture = await Furniture.findById(id);

		if (!existingFurniture) {
			return res.status(404).json({ message: "Furniture not found!" });
		}

		await existingFurniture.deleteOne();
		res.status(200).json({ message: "Furniture deleted successfully!" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error!" });
	}
};
