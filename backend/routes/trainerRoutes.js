const express = require('express');
const { createOrUpdateTrainer, getAllTrainers } = require('../controllers/trainerController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllTrainers);
router.post('/', protect, createOrUpdateTrainer);

module.exports = router;
