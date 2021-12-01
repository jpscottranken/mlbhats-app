/*
	orderActions
	============
	
	This action file handles all actions related to orders in the
	application. It has three functions used to get all orders of a 
	user, place a new order (checkout) and set the orders as loading.

	getOrders — This function first sets the orders as loading. Next,
				it uses the id of the user received as a param in 
				making a GET request. Next, set the type as GET_ORDERS
				the payload as data received as the response.

	checkout —  This function is used to place an order. It receives two
				parameters from the components which are the id of the user
				and source generated from stripe checkout functions which
				will be dealt with later. The id is used as a param and
				source as rthe equest body to make a POST request. Next,
				set the type as CHECKOUT and the payload as response data.

	setOrdersLoading — This function sets the order type as ORDERS_LOADING.

Here is the associated code:
*/

import axios from 'axios';
import { returnErrors } from './errors';
import { GET_ORDERS, CHECKOUT, ORDERS_LOADING } from './types';

//	This function first sets the orders as loading.
export const getOrders = (id) => dispatch => {
    dispatch(setOrdersLoading());
    axios.get(`/api/order/${id}`)
	.then(res => dispatch({
		type: GET_ORDERS,
		payload: res.data
	}))
	.catch(err => dispatch(returnErrors(
					err.response.data, err.response.status)));
}

//	This function is used to place an order.
export const checkout = (id, source) => dispatch => {
    axios.post(`/api/order/${id}`, {source})
	.then(res => dispatch({
		type: CHECKOUT,
		payload: res.data
	}))
	.catch(err => dispatch(returnErrors(
					err.response.data, err.response.status)));
}

export const setOrdersLoading = () => {
    return {
        type: ORDERS_LOADING
    }
}
