import express from 'express'
import passport from 'passport'
import { Router as UnoRouter } from 'uno-api'
import { wrapperRequest } from 'helpers/ExpressHelpers'
import multerCSV from 'middleware/multerCSV'

/* Setup Router With Middleware */
const router = express.Router()
const apiPrivate = new UnoRouter(router, {
  middleware: passport.authenticate('jwt', { session: false }),
  wrapperRequest,
})
require('config/passport')(passport)

/* Declare Controller */
const AuthController = require('controllers/AuthController')
const RoleController = require('controllers/RoleController')
const UserController = require('controllers/UserController')

/* Master Controller */
const MasterTipeIdentitasController = require('controllers/MasterTipeIdentitasController')

/* Authentication */
apiPrivate.create({
  baseURL: '/auth',
  getWithParam: [['verify', AuthController.verifyToken]],
  putWithParam: [['change-password/:id', AuthController.changePass]],
})

apiPrivate.create({
  baseURL: '/profile',
  get: AuthController.getProfile,
})

/* User */
apiPrivate.create({
  baseURL: '/user',
  post: [multerCSV, UserController.create],
  putWithParam: [[':id', multerCSV, UserController.update]],
  deleteWithParam: [[':id', UserController.destroy]],
})

/* Role */
apiPrivate.create({
  baseURL: '/role',
  post: RoleController.create,
  putWithParam: [[':id', RoleController.update]],
  deleteWithParam: [[':id', RoleController.destroy]],
})

/* Master Tipe Identitas */
apiPrivate.create({
  baseURL: '/master-tipe-identitas',
  post: MasterTipeIdentitasController.create,
  putWithParam: [[':id', MasterTipeIdentitasController.update]],
  deleteWithParam: [[':id', MasterTipeIdentitasController.destroy]],
})

module.exports = router
