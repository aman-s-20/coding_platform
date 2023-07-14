const express = require('express');
const router = express.Router();

const authMiddleware = require('../middlewares/authMiddleware');
const testCaseController = require('../controllers/testCaseController');



router.post('/:problemId', authMiddleware.authenticateUser,authMiddleware.checkAdminRole, testCaseController.createTestCase);

module.exports = router;