/*
======================

authActions.js
==============

This is the most involved part of the actions file.  It handles
the authentication part. We have four functions in this part:

loadUser	- First set the type as USER_LOADING to indicate
			  that the user is currently loading. We then make a
			  request using Axios to the API endpoint '/api/user'
			  along with the token obtained from the tokenconfig
			  which will then get the result and set the payload
			  as the data fetched from the API endpoint. The type
			  is set as USER_LOADED as we have successfully loaded
			  the user. In case of error, call the returnErrors
			  function and set the type to AUTH_ERROR.

register	- Takes in the name, email and password from the frontend
			  and makes these a JSON object. Then hit the API endpoint
			  for register and pass in the data. Then receive a 
			  response and set the data received as payload and the
			  type REGISTER_SUCCESS. Handle errors in the same way as
			  previously by setting the error type as REFGISTER_FAIL.

login		- This works similarly to the register function. The
			  difference is that the login function gets the email and
			  password only and then it hits the API endpoint meant
			  for the login. We get a response and set the payload as
			  the data received from the response and set the type as
			  LOGIN_SUCCESS. Handle errors in the same way as
			  previously by setting the error type as LOGIN_FAIL.

logout		- Set the type as LOGOUT_SUCCESS. That is all that's needed
			  for logout.

We also have a helper function tokenconfig to get a token from
local storage and set up the config to send a request using
loadUser for fetching the currently logged in user details.

We will handle all the responses type and their payload in the reducers
described next.
*/

import axios from 'axios';
import { returnErrors } from './errors';
import { USER_LOADING, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT_SUCCESS, REGISTER_SUCCESS, REGISTER_FAIL} from './types';

export const loadUser = () => (dispatch, getState) => {
    // User loading
    dispatch({ type: USER_LOADING });

    axios.get('/api/user', tokenConfig(getState))
        .then(res => dispatch({
            type: USER_LOADED,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status));
            dispatch({
                type: AUTH_ERROR
            });
        });
}

export const register = ({name, email, password}) => dispatch => {
    // headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    //request body
    const body = JSON.stringify({name, email, password});

    axios.post('/api/register', body, config)
        .then(res => dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'REGISTER_FAIL'));
            dispatch({
                type: REGISTER_FAIL
            });
        });
}

export const login = ({email, password}) => dispatch => {
    // headers
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    //request body
    const body = JSON.stringify({email, password});

    axios.post('/api/login',body,config)
        .then(res => dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        }))
        .catch(err => {
            dispatch(returnErrors(err.response.data, err.response.status, 'LOGIN_FAIL'));
            dispatch({
                type: LOGIN_FAIL
            });
        });
}

// logout user
export const logout = () => {
    return {
        type: LOGOUT_SUCCESS
    }
}


// Setup config/headers and token
export const tokenConfig = getState => {
    //Get token from local storage
    const token = getState().auth.token;

    // Headers
    const config = {
        headers:{
            "Content-type": "application/json",
        }
    }

    if(token){
        config.headers['x-auth-token'] = token;
    }

    return config;
}
