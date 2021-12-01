/*
	We will deal with all of them one by one here. We will start with the
	errorActions as this is fairly easy and does not require interacting
	with the server.

	There are also two functions in this actions file.

	One is for returning any error we have in our application.
	This function will take a message, status and id in the function
	and will return them as payload with the type of GET_ERRORS. 

	The other is for clearing out these errors when we do not need to
	display them. The next function will clear the errors by sending
	the type as CLEAR_ERRORS.  These will be handled in the errors
	reducers file we will build in the next part which will handle
	the state as specified by these functions.

Here is the associated code:
*/
import { GET_ERRORS, CLEAR_ERRORS } from './types';

// RETURN ERRORS
export const returnErrors = (msg, status, id = null) => {
    return {
        type: GET_ERRORS,
        payload: { msg, status, id }
    }
}

// CLEAR ERRORS
export const clearErrors = () => {
    return {
        type: CLEAR_ERRORS
    }
}
