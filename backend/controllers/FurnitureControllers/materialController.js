const Materials = require('../../models/Furniture/materialsModel')

exports.addMaterials = async (req,res) =>{
  try {
    const {name, quantity} = req.body;

    if(!name || !quantity){
      res.status(401).json({message:"Material's name and quantity are required!"})
    }

    const newMaterial = new Materials({name,quantity});
    await newMaterial.save();
    res.status(201).json({message:`${newMaterial.name} added successfully!`})
  } catch (error) {
    console.log("Error adding material : ",error);
    res.status(500).json({message:"Server error"});
  }
}

exports.getSpecificMaterial = async (req,res)=>{
  try {
    const {materialId} = req.params;

    const material = await Materials.findById(materialId);
    if(!material) return res.status(404).json({message:"Material not found!"});

    res.status(200).json(material);
  } catch (error) {
    console.log("Error fetching archived materials: ",error);
    res.status(500).json({message:"Server error!"})
  }
}

exports.getMaterials = async (req,res) =>{
  try {
    const materials = await Materials.find({isArchived:false});
    if(materials.length === 0){
      res.status(404).json({message:"No materials found!"})
    }

    res.status(200).json(materials)
  } catch (error) {
    console.log("Error fetching materials : ",error);
    res.status(500).json({message:"Server error"});
  }
}

exports.ArchivedMaterials = async (req,res)=>{
  try {
    const archivedMaterials = await Materials.find({isArchived:true});
    if(archivedMaterials.length === 0) return res.status(400).json({message:"No archived materials found!"});

    res.status(200).json(archivedMaterials);

  } catch (error) {
    console.log("Error fetching archived materials: ",error);
    res.status(500).json({message:"Server error!"})
  }
}

exports.ArchivingMaterials = async (req,res)=>{
  try {
    const {materialId} = req.params;

    const material = await Materials.findById(materialId);
    if(!material) return res.status(404).json({message:"Material not found!"});

    material.isArchived=true;
    await material.save();
    res.status(200).json({message:`${material.name} has been archived successfully!`});
  } catch (error) {
    console.log("Error fetching archived materials: ",error);
    res.status(500).json({message:"Server error!"})
  }
}

exports.UnArchivingMaterials = async (req,res)=>{
  try {
    const {materialId} = req.params;

    const material = await Materials.findById(materialId);
    if(!material) return res.status(404).json({message:"Material not found!"});

    material.isArchived=false;
    await material.save();
    res.status(200).json({message:`${material.name} has been unarchived successfully!`});
  } catch (error) {
    console.log("Error fetching archived materials: ",error);
    res.status(500).json({message:"Server error!"})
  }
}

exports.editMaterial = async (req,res) => {
  try {
    const {materialId} = req.params;
    const material = await Materials.findById(materialId);
    if(!material) return res.status(404).json({message:"Material not found!"});

    const {name, quantity} = req.body;
    if(!name || !quantity) return res.status(400).json({message:"All fields are required! : name, quantity"})

        // Check if any changes were made
    if (material.name === name && material.quantity === quantity) {
      return res.status(400).json({ message: "No changes made!" });
    }

    material.name = name;
    material.quantity = quantity;

    await material.save();
    res.status(200).json({message:`${material.name} has been edited successfully!`});
  } catch (error) {
    console.log("Error editing the materials: ",error);
    res.status(500).json({message:"Server error!"});
  }
}