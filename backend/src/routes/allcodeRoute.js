const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const {
    getAllCodesByType,
    getAllTypes,
    getCodeByKey,
    createCode,
    updateCode,
    deleteCode
} = require('../controllers/allcodeController');

// Public routes
router.get('/type', protect, authorizeRoles('R3'), getAllCodesByType);
router.get('/types', protect, authorizeRoles('R3'), getAllTypes);
router.get('/:keyMap', protect, authorizeRoles('R3'), getCodeByKey);

// Admin routes
router.post('/', protect, authorizeRoles('R3'), createCode);
router.put('/:keyMap', protect, authorizeRoles('R3'), updateCode);
router.delete('/:keyMap', protect, authorizeRoles('R3'), deleteCode);

module.exports = router; 