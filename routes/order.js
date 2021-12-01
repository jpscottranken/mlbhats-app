/*
	Order Routes (order.js)
	=====================
	This file deals with the routes for handling orders. It has
	two routes:

	get_orders — Is a get request to fetch all orders made in the application.
				 It accepts a param id (userId) to help return the correct user order.

	checkout   — Is a post request, also has a param id for finding a user. Its 
				 function is to create a new order. All payments are handled by this route.
				 We will see those in its controller.

	Here is the code for order.js
*/

const { Router } = require("express")
const orderController = require("../controllers/orderController")
const router = Router()

router.get("/order/:id", orderController.get_orders)
router.post("/order/:id", orderController.checkout)

module.exports = router
