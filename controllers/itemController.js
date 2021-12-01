//	Next is the itemContoller.js file.  This controller file
//	handles all logic related to the items, e.g. add an item,
//	get all items, delete an item or modify an item.

//	This is the only required model for this file.
const Item = require("../models/Item")

//	This function will get all items from the database
//	and sort them in descending order by date added. We then return these items in JSON format.
module.exports.get_items = (req, res) => {
  Item.find()
    .sort({ date: -1 })
    .then((items) => res.json(items))
}

//	Next add a new item to the cart. We use the request
//	body as input for the new item.  We are sending the request
//	body from frontend in the same format as in our model.
//	Save the item in the database and send the new item as
//	the response in JSON format.
module.exports.post_item = (req, res) => {
  const newItem = new Item(req.body)
  newItem.save().then((item) => res.json(item))
}

//	Next update an item. We receive updated information
//	through the request body and the item id through the
//	params. Use the function findByIdAndUpdate to search
//	for the item and update it with the new information.
//	Then send the updated item as the response.
module.exports.update_item = (req, res) => {
  Item.findByIdAndUpdate({ _id: req.params.id }, req.body).then(function (
    item
  ) {
    Item.findOne({ _id: req.params.id }).then(function (item) {
      res.json(item)
    })
  })
}

//	Finally, deletion of items from the database.
//	Receive the item id through the params. Next,
//	find the item and delete it using findByIdAndDelete
//	function and return a success response.
module.exports.delete_item = (req, res) => {
  Item.findByIdAndDelete({ _id: req.params.id }).then(function (item) {
    res.json({ success: true })
  })
}
