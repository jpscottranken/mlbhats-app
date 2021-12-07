/*
	cartController.js
	-----------------
	This controller file handles the logic for the cart, e.g. adding items
	to the cart, deleting items from the cart and getting the cart items to
	display along with the total cost.
	
	First we must require the Cart and the Item models into this file.
*/

const Cart = require("../models/Cart")
const Item = require("../models/Item")

//	The first task is to create the function that fetches all the items
//	in our cart for displaying in the application frontend.

module.exports.get_cart_items = async (req, res) => {
  //	Get the user id of the user whose cart we want to access.
  const userId = req.params.id
  try {
    //	Search for a cart with that username.
    let cart = await Cart.findOne({ userId })

    //	If we find a cart with that username and the cart is not empty
    //	return the cart. Otherwise return null.
    //
    //	NOTE: We handle the same in the frontend by checking and informing
    //	users that cart is empty if we send a null value.
    if (cart && cart.items.length > 0) {
      res.send(cart)
    } else {
      res.send(null)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong")
  }
}

//	Next, we will handle adding items to our cart.
module.exports.add_cart_item = async (req, res) => {
  //	We get the userId by params and productId and quantity via the request body.
  //	We need userId to access the cart for that user.
  //	We need productId for finding the item to add to the cart.
  const userId = req.params.id
  const { productId, quantity } = req.body

  try {
    //	NOTE: There are two scenarios: a user has a cart or does not have one.
    let cart = await Cart.findOne({ userId })
    let item = await Item.findOne({ _id: productId })

    //	Get the item from the productId received. If the item
    //	is not found, send a response stating this.
    if (!item) {
      res.status(404).send("Item not found!")
    }

    const price = item.price
    const name = item.name

    //	If the user has a cart, search for the item needed to add.
    //	First try to find a cart with the userId we have.
    if (cart) {
      // if cart exists for user
      let itemIndex = cart.items.findIndex((p) => p.productId == productId)

      // 	Check if product exists or not
      // 	If the item already exists in the cart, increase its quantity
      //	by the quantity received and assign the updated item to the cart.
      if (itemIndex > -1) {
        let productItem = cart.items[itemIndex]
        productItem.quantity += quantity
        cart.items[itemIndex] = productItem
      }
      //	If the item is not present in the cart, push to the carts item array.
      //	Update the cart bill and in both cases, save the cart. Then send the
      //	cart back as a response.
      else {
        cart.items.push({ productId, name, quantity, price })
      }

      cart.bill += quantity * price
      cart = await cart.save()

      return res.status(201).send(cart)
    } else {
      //	In the second case, the user does not already have a cart.
      //	So we create a new cart for the user with the userId, the
      //	item to add and the bill. Return the new cart as a response.
      // no cart exists, create one
      const newCart = await Cart.create({
        userId,
        items: [{ productId, name, quantity, price }],
        bill: quantity * price,
      })

      return res.status(201).send(newCart)
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong")
  }
}

//	Now, perform a possible update
module.exports.update_cart_item = async (req, res) => {
    const userId = req.params.id;
    const { productId, qty } = req.body;

    try {
        let cart = await Cart.findOne({userId});
        let item = await Item.findOne({_id: productId});

        if(!item) {
            return res.status(404).send('Item not found!');
		}
        
        if(!cart) {
          return res.status(400).send("Cart not found");
		}
        else {
            // if cart exists for the user
            let itemIndex = cart.items.findIndex(p => p.productId == productId);

            // Check if product exists or not
            if(itemIndex == -1) {
              return res.status(404).send('Item not found in cart!');
			}
            else {
                let productItem = cart.items[itemIndex];
                productItem.quantity = qty;
                cart.items[itemIndex] = productItem;
            }
            cart.bill = cart.items.reduce((sum, item) => sum + item.price * item.quantity,0);
            cart = await cart.save();
            return res.status(201).send(cart);
        }     
    }
    catch (err) {
        // just printing the error wont help us find where is the error. Add some understandable string to it.
        console.log("Error in update cart", err);
        res.status(500).send("Something went wrong");
    }
}


//	Now, perform the final function related to the cart; i.e. delete items from the cart.
module.exports.delete_item = async (req, res) => {
  //	We receive two params; userId and productId
  //	Search for the cart with the userId and also search for the item using the productId.
  const userId = req.params.userId
  const productId = req.params.itemId
  try {
    let cart = await Cart.findOne({ userId })
    let itemIndex = cart.items.findIndex((p) => p.productId == productId)
    if (itemIndex > -1) {
      //	If we have the item in the cart, take the item from the cart
      //	and reduce the bill accordingly.
      //	Then use splice() to remove the item from the cart.
      let productItem = cart.items[itemIndex]
      cart.bill -= productItem.quantity * productItem.price
      cart.items.splice(itemIndex, 1)
    }

    //	Save the cart and return it as a response to the user.
    cart = await cart.save()
    return res.status(201).send(cart)
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong")
  }
}
