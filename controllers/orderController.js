/*
	orderController.js
	-----------------
	This controller file handles all logic for the orders. It would handle 
	viewing all orders, allow us to place a new order from the items in the cart,
	and handle payments via Stripe Checkout.
	
	This consists of two functions, one each for the two routes.
	We must install the Stripe library into our application.
	Use the command "npm install stripe" to install stripe. 
	Verify it has been added as a dependency in package.json
	Also, we need to add StripeAPIKey in our config file. 
	Go to https://stripe.com/docs/keys for this

	So, the updated default.json file inside of the config folder:
	
	{
		"dbURI": "mongodb+srv://user1:iFL4mA4jRSGGYWHg@sandbox.xd2pm.mongodb.net/hats?retryWrites=true&w=majority",
		"jwtsecret": "jwtSecretKey",
		"StripeAPIKey": "sk_test_4eC39HqLyjWDarjtT1zdp7dc"
	}

	//	We need to require the following for the orderControllers file:
*/

const Order = require("../models/order")
const Cart = require("../models/Cart")
const User = require("../models/User")
const config = require("config")
const stripe = require("stripe")(config.get("StripeAPIKey"))

//	This function will fetch all orders for a particular user.
//	We need to find the orders using the userId provided, sort them
//	in descending order by date ordered and return them as a JSON response.

module.exports.get_orders = async (req, res) => {
  const userId = req.params.id
  Order.find({ userId })
    .sort({ date: -1 })
    .then((orders) => res.json(orders))
}

//	Next is the checkout function.
module.exports.checkout = async (req, res) => {
  try {
    //	We receive the userId as a param with this request.
    //	In addition, we receive a source as the request body
    //	from the frontend to handle payments via Stripe.
    const userId = req.params.id
    const { source } = req.body

    //	Find the Cart and the User using the userId provided.
    //	Also get the email of the user.
    let cart = await Cart.findOne({ userId })
    let user = await User.findOne({ _id: userId })
    const email = user.email

    //	Next, check if the cart exists or if not.
    //	If the cart exists, create a charge using Stripe. Pass in the amount,
    //	the currency to receive payments in, the source object received from
    //	the frontend and the receipt_email.
    if (cart) {
      const charge = await stripe.charges.create({
        amount: cart.bill*100,
        currency: "usd",
        source: source,
        receipt_email: email,
      })

      //	If the charge was not successfully created, throw an error
      //	stating that the payment failed.
      if (!charge) {
        throw Error("Payment failed")
      }

      //	If the charge was successful, create a new order with userId,
      //	the cart items, and the bill.
      if (charge) {
        const order = await Order.create({
          userId,
          items: cart.items,
          bill: cart.bill,
        })

        //	Finally, delete the cart using the cartId.
        //	Then send the order as a response to the frontend.
        const data = await Cart.findByIdAndDelete({ _id: cart.id })
        return res.status(201).send(order)
      }
    }
    //	If the cart has no items in it, send a response
    //	stating that the cart is empty.
    else {
      res.status(500).send("You do not have any items in the cart")
    }
  } catch (err) {
    console.log(err)
    res.status(500).send("Something went wrong")
  }
}
