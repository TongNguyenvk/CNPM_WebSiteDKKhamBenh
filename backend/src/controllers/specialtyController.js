const { Specialty } = require('../models');

exports.getAllSpecialties = async (req, res) => {
    try {
        const specialties = await Specialty.findAll();
        res.status(200).json(specialties);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching specialties', error: error.message });
    }
};

exports.getSpecialtyById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ID
        if (!id || isNaN(parseInt(id))) {
            return res.status(400).json({ message: 'Invalid specialty ID' });
        }

        // Tìm chuyên khoa theo ID
        const specialty = await Specialty.findByPk(id);

        if (!specialty) {
            return res.status(404).json({ message: `Specialty with ID ${id} not found` });
        }

        res.status(200).json(specialty);
    } catch (error) {
        console.error("Error fetching specialty:", error);
        res.status(500).json({ message: 'Error fetching specialty details', error: error.message });
    }
};


exports.createSpecialty = async (req, res) => {
    try {
        const { name, image, description } = req.body; // description sẽ ở dạng HTML từ WYSIWYG editor

        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }

        const newSpecialty = await Specialty.create({
            name,
            image,
            description // Lưu HTML vào database
        });

        res.status(201).json({ message: "Specialty created successfully", specialty: newSpecialty });
    } catch (error) {
        console.error("Error creating specialty:", error);
        res.status(500).json({ message: "Error creating specialty", error: error.message });
    }
};


exports.updateSpecialty = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image } = req.body; // description là HTML

        const specialty = await Specialty.findByPk(id);
        if (!specialty) {
            return res.status(404).json({ message: `Specialty with ID ${id} not found` });
        }

        specialty.name = name || specialty.name;
        specialty.description = description || specialty.description;
        if (image !== undefined) {
            specialty.image = image;
        }

        await specialty.save();
        res.status(200).json({ message: "Specialty updated successfully", specialty });
    } catch (error) {
        console.error("Error updating specialty:", error);
        res.status(500).json({ message: "Error updating specialty", error: error.message });
    }
};


exports.deleteSpecialty = async (req, res) => {
    try {
        const { id } = req.params;

        const specialty = await Specialty.findByPk(id);

        if (!specialty) {
            return res.status(404).json({ message: 'Specialty not found' });
        }

        await specialty.destroy();

        res.status(200).json({ message: 'Specialty deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting specialty', error: error.message });
    }
};

exports.uploadImage = async (req, res) => {
    try {
        console.log('--- [UPLOAD SPECIALTY IMAGE] ---');
        console.log('req.file:', req.file);
        
        if (!req.file) {
            console.log('No file received');
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Trả về URL của ảnh đã upload
        const imageUrl = `/uploads/specialties/${req.file.filename}`;
        console.log('Image saved at:', imageUrl);
        
        res.status(200).json({ 
            message: 'Image uploaded successfully',
            url: imageUrl,
            filename: req.file.filename
        });
    } catch (error) {
        console.error('Error uploading image:', error);
        res.status(500).json({ message: 'Error uploading image', error: error.message });
    }
};
