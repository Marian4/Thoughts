const express = require('express')
const route = express.Router()
const authChecker = require('../helpers/auth')
const ToughtsController = require('../controllers/ToughtsController')

route.get('/dashboard', authChecker, ToughtsController.dashboard)
route.get('/add', authChecker, ToughtsController.create)
route.post('/add', authChecker, ToughtsController.createPost)
route.get('/edit/:toughtId', authChecker, ToughtsController.edit)
route.post('/edit/:toughtId', authChecker, ToughtsController.editPost)
route.post('/delete/:toughtId', authChecker, ToughtsController.delete)
route.get('/', authChecker,ToughtsController.getAllToughts)

module.exports = route