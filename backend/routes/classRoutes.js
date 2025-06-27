const express = require('express');
const {
  createClass,
  getAllClasses,
  getClassById,
} = require('../controllers/classController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllClasses);
router.get('/:id', getClassById);
router.post('/', protect, createClass);

module.exports = router;
