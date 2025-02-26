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



        // Tìm chuyên khoa theo ID
        const specialty = await Specialty.findByPk(id);

        if (!specialty) {
            return res.status(404).json({ message: `Specialty with ID ${specialtyId} not found` });
        }

        res.status(200).json(specialty);
    } catch (error) {
        console.error("Error fetching specialty:", error);
        res.status(500).json({ message: 'Error fetching specialty details', error: error.message });
    }
};


exports.createSpecialty = async (req, res) => {
    try {
        const { name, description } = req.body; // description sẽ ở dạng HTML từ WYSIWYG editor

        if (!name || !description) {
            return res.status(400).json({ message: "Name and description are required" });
        }

        const newSpecialty = await Specialty.create({
            name,
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
        const { specialtyId } = req.params;
        const { name, description } = req.body; // description là HTML

        const specialty = await Specialty.findByPk(specialtyId);
        if (!specialty) {
            return res.status(404).json({ message: `Specialty with ID ${specialtyId} not found` });
        }

        specialty.name = name || specialty.name;
        specialty.description = description || specialty.description;

        await specialty.save();
        res.status(200).json({ message: "Specialty updated successfully", specialty });
    } catch (error) {
        console.error("Error updating specialty:", error);
        res.status(500).json({ message: "Error updating specialty", error: error.message });
    }
};


exports.deleteSpecialty = async (req, res) => {
    try {
        const { specialtyId } = req.params;

        const specialty = await Specialty.findByPk(specialtyId);

        if (!specialty) {
            return res.status(404).json({ message: 'Specialty not found' });
        }

        await specialty.destroy();

        res.status(200).json({ message: 'Specialty deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting specialty', error: error.message });
    }
};
