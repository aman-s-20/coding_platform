const express = require('express');
const router = express.Router();
const solutionController = require('../controllers/solutionController');

router.post('/:problemId', solutionController.submitSolution);

module.exports = router;
