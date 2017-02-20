import express from 'express'
import * as indexController from '../controllers/index'

const router = express.Router()

router
  .get('/', indexController.showIndex)
  .get('/clear', (req, res, next) => {
    res.clearCookie('username')
    res.end()
  })

export default router
