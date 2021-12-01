/*
	cartActions
	===========
	
	This handles all actions related to the cart of any user. 
	It has four functions which are getting the cart, adding 
	items to cart, deleting items from the cart and set the 
	cart status to loading.

	getCart — 		 This function is used to fetch the cart for any user. 
					 First set cart as loading. Then pass on the id as a 
					 param with the API endpoint and receive a response
					 consisting of the user cart. Set the type as GET_CART.

	addToCart — 	 This function is used to add an item to cart. It takes 
					 in the id of the user which it uses as param and also 
					 passes on the productId and quantity as the request 
					 body. We then receive a response which we assign to 
					 the payload and set the type as ADD_TO_CART.

	deleteFromCart — This function is used to delete an item from the cart. 
					 It takes in the userId and the itemId and passes these 
					 as params to the API endpoint. Then set the type to 
					 DELETE_FROM_CART and the payload as the response data.

	setCartLoading — This sets the type as CART_LOADING

Here is the associated code:
*/

import axios from 'axios';
import { returnErrors } from './errors';
import { GET_CART, ADD_TO_CART, DELETE_FROM_CART, CART_LOADING } from './types';

//	 This function is used to fetch a cart for a user
export const getCart = (id) => dispatch => {
    dispatch(setCartLoading());
    axios.get(`/api/cart/${id}`)
	.then(res => dispatch({
		type: GET_CART,
		payload: res.data
	}))
	.catch(err => dispatch(returnErrors(
				err.response.data, err.response.status)));
}

//	This function is used to add an item to cart.
export const addToCart = (id, productId, quantity) => dispatch => {
    axios.post(`/api/cart/${id}`, {productId, quantity})
	.then(res => dispatch({
		type: ADD_TO_CART,
		payload: res.data
	}))
	.catch(err => dispatch(returnErrors(
				err.response.data, err.response.status)));
}

//	This function is used to update a cart item
export const updateCart = (userId, productId, qty) => dispatch => {
  dispatch(setCartLoading());
  axios.put(`/api/cart/${userId}`, {productId, qty})
      .then(res => dispatch({
          type: GET_CART,
          payload: res.data
      }))
      .catch(err => {
        console.log("Error in update cart:", err);
        dispatch(returnErrors(err.response.data, err.response.status))
      });
}

//	This function is used to delete an item from the cart.
export const deleteFromCart = (userId, itemId) => dispatch => {
	axios.delete(`/api/cart/${userId}/${itemId}`)
	.then(res => dispatch({
		type: DELETE_FROM_CART,
		payload: res.data
	}))
	.catch(err => dispatch(returnErrors(
				err.response.data, err.response.status)));
}

export const setCartLoading = () => {
    return {
        type: CART_LOADING
    }
}
