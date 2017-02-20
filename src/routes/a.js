import express from 'express'

const router = express.Router()

router.get('/aa', function (req, res, next) {
  res.end('aaa')
})

export default router
