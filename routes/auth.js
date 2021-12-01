//	Begin by requiring Router from express in our file. We will be using 
//	the express router to build all our routes
const { Router } = require('express');

//	We also bring in the authControllers from the controllers' folder
//	We will create this file later.
const authController = require('../controllers/authController');

//	Create a Router object
const router = Router();

//	Add custom middleware function auth from the middleware folder.
//	We will create this file later.
const auth = require('../middleware/auth');

//	This route handles a post request in which a user provides his
//	or her name, email and password for registering for an account.
router.post('/register', authController.signup);

//	This route handles the user login part of the website. It lets
//	users log in and checks whether their credentials are correct.
router.post('/login', authController.login);

//	This route is a get request where you try to retrieve whether a
//	user is logged in or not using this route.
router.get('/user', auth, authController.get_user);

module.exports = router;