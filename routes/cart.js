/*
	Cart Routes (cart.js)
	=====================
	cart.js deals with all the routes related to the cart. It has 
	three routes:

	get_cart_items — This route makes a get request to fetch all items of a particular user. 
					 The id of the user requesting the cart is passed as a param.
					 
	add_cart_item  — This route makes a post request used to add an item to the cart. It also
					 has a param id to identify the user adding the item to their cart.

	delete_item    — This route is a delete request to remove an item from the cart. It takes
					 in two params: userId to get the cart of that particular user and 
					 itemId to search for the item and remove it from the cart.

	Here is the code for cart.js:
*/

const { Router } = require("express")
const cartController = require("../controllers/cartController")
const router = Router()

router.get("/cart/:id",  cartController.get_cart_items)
router.post("/cart/:id", cartController.add_cart_item)
router.put('/cart/:id',  cartController.update_cart_item);
router.delete("/cart/:userId/:itemId", cartController.delete_item)

module.exports = router
