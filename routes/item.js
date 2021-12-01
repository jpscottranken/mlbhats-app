//	Again begin by requiring Router from express in our file.
const { Router } = require("express")

//	Again bring in the itemControllers from the controllers' folder
const itemController = require("../controllers/itemController")

//	Again create a Router object
const router = Router()

//	This route is a get request. The purpose of this route is to fetch
//	all items from the server.
router.get("/items", itemController.get_items)

//	This route is a post request. The purpose of this route is to add
//	a new item to the database.
router.post("/items", itemController.post_item)

//	This route is a put request. The purpose of this route is to
//	update an existing database item
router.put("/items/:id", itemController.update_item)

//	This route is a delete request. The purpose of this route is to
//	delete a database item.
router.delete("/items/:id", itemController.delete_item)

module.exports = router
