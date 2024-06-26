const express = require('express')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')
const {
  getStudentHomeworks,
  getSubmittedHomeworks,
  getSubmittedHomeworkDetails,
  getHomework,
  addHomework,
  updateHomework,
} = require('../controllers/studentHomeworkController')

// Protected Routes
router.get('/student/:id', authMiddleware(), getStudentHomeworks)
router.get('/:id', authMiddleware(), getHomework)
router.post('/', authMiddleware(), addHomework)
router.get('/student/:id/submitted', authMiddleware(), getSubmittedHomeworks)
router.get(
  '/student/:studentId/submitted/:homeworkId',
  authMiddleware(),
  getSubmittedHomeworkDetails
)
router.put('/:id', authMiddleware(), updateHomework)

module.exports = router
