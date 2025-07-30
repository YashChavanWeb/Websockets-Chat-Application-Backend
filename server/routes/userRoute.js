const express = require('express')
const { registerUser, loginUser, fetchUser, getUsers } = require('../controllers/userController')
const router = express.Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/find/:userId', fetchUser)
router.get('/', getUsers)


module.exports = router