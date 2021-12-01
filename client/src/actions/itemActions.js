/*
======================

	itemActions
	===========

	Here, we handle all of the actions related to the items i.e. 
	products being displayed on the website.

	It has five functions which would manage:

	getItems — 	This function is used for fetching all the items 
				from the backend using API endpoint designed for 
				getting them. First set the items as loading and
				then reach the API endpoint to get all items.
				Next, set the type as GET_ITEMS and set payload
				as the data received as a response.

	addItem —  	This function is used for adding a new item to the
				database. We take in the item object through frontend
				forms and then send the data to the API endpoint 
				responsible for adding the item. Next, set the type
				as ADD_ITEM and the payload as the data received
				from the response.

	deleteItem — This function is used to delete an existing item from
				 the database. It takes in the id of the item to delete
				 and sends the id using a delete request to the API
				 endpoint meant for this. Next, set the type as 
				 DELETE_ITEM and the payload as the id of the item
				 that was deleted.

	updateItem — This function is used to update an existing item in
				 inventory. It makes a put request to the API endpoint
				 with the id and also sends in the new item object.
				 Next, set the type as UPDATE_ITEM and set the 
				 payload as the id and the data received as the
				 response from the server.

	setItemsLoading — This function sets the type as ITEMS_LOADING

	We will not be using deleting and updating of items in the application
	components in this series but having everything ready is a good choice
	in case they are added later on.

	Note: You can add a separate portal for managing all items like adding
		  them, deleting them and updating them. We only cover adding items
		  and getting all items in the components though we have APIs,
		  actions and reducers ready for all these tasks.

Here is the associated code:
*/

import axios from 'axios';
import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, UPDATE_ITEM, ITEMS_LOADING } from './types';
import { returnErrors } from './errors';

//	This function is used for fetching all 
//	items from the backend using API endpoint.
export const getItems = () => dispatch => {
	dispatch(setItemsLoading());
	axios.get('/api/items')
	.then(res => dispatch({
		type: GET_ITEMS,
		payload: res.data
	}))
	.catch(err => dispatch(returnErrors(
				err.response.data, err.response.status)));
}

//	This function is used to add an item to the database.
export const addItem = (item) => (dispatch) => {
	axios.post('/api/items', item)
	.then(res => dispatch({
		type: ADD_ITEM,
		payload: res.data
	}))
	.catch(err => dispatch(returnErrors(
				err.response.data, err.response.status)))
}

//	This function is used to delete an item from the database.
export const deleteItem = (id) => (dispatch) => {
	axios.delete(`/api/items/${id}`)
	.then(res => dispatch({
		type: DELETE_ITEM,
		payload: id
	}))
	.catch(err => dispatch(returnErrors(
				err.response.data, err.response.status)))
}

//	This function is used to update an existing item.
export const updateItem = (id, item) => (dispatch) => {
	axios.put(`/api/items/${id}`, item)
	.then(res => dispatch({
		type: UPDATE_ITEM,
		payload: Promise.all([id, res.data])
	}))
	.catch(err => dispatch(returnErrors(
				err.response.data, err.response.status)))
}
	
export const setItemsLoading = () => {
	return {
		type: ITEMS_LOADING
	}
}
