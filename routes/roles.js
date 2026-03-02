const express = require('express');
const router = express.Router();
const Role = require('../schemas/roles');

// GET all roles (not deleted)
router.get('/', async (req, res) => {
    try {
        const roles = await Role.find({ isDeleted: false });
        res.status(200).json({ success: true, data: roles });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET role by ID
router.get('/:id', async (req, res) => {
    try {
        const role = await Role.findOne({ _id: req.params.id, isDeleted: false });
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        res.status(200).json({ success: true, data: role });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// POST to create a new role
router.post('/', async (req, res) => {
    try {
        const newRole = new Role(req.body);
        const savedRole = await newRole.save();
        res.status(201).json({ success: true, data: savedRole });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// PUT to update a role
router.put('/:id', async (req, res) => {
    try {
        const updatedRole = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedRole) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        res.status(200).json({ success: true, data: updatedRole });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// DELETE (soft delete) a role
router.delete('/:id', async (req, res) => {
    try {
        const role = await Role.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!role) {
            return res.status(404).json({ success: false, message: 'Role not found' });
        }
        res.status(200).json({ success: true, message: 'Role soft deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
