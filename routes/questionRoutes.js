const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const authMiddleware = require('../middlewares/authMiddleware');
const testCaseController = require('../controllers/testCaseController');


router.post('/', authMiddleware.authenticateUser,authMiddleware.checkAdminRole, questionController.createQuestion);
router.put('/:problemId', authMiddleware.authenticateUser,authMiddleware.checkAdminRole, questionController.editQuestion);
router.delete('/:problemId', authMiddleware.authenticateUser,authMiddleware.checkAdminRole, questionController.deleteQuestion);


module.exports = router;
