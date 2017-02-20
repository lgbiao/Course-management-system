import express from 'express'
import * as courseController from '../controllers/course'

const router = express.Router()

router
  .get('/course', courseController.showCourse)

export default router
