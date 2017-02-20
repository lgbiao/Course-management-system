import express from 'express'
import * as managerController from '../controllers/manager'

const router = express.Router()

router
  .get('/register', managerController.showRegister)
  .post('/register', managerController.doRegister)
  .get('/login', managerController.showLogin)
  .post('/login', managerController.doLogin)
  .get('/logout', managerController.logout)

export default router
