//	First require the config and jwt in our file.
const config = require('config');
const jwt = require('jsonwebtoken');

//	Then start making the auth middleware function.
//	We get the token from request header part named 
//	'x-auth-token'. If there was a token, we will 
//	verify the token and send the decoded variable
//	as the response.
function auth(req, res, next) {
	const token = req.header('x-auth-token');

	// Check for token
	if(!token) {
		return res.status(401).json({ msg: 'No token, authorization denied'});
	}
	
	try {
		//	Verify token
		const decoded = jwt.verify(token, config.get('jwtsecret'));
		
		//	Add user from payload
		req.user = decoded;
		
		//	Use the next() function to move on to the next function.
		next();
	} catch(e) {
		res.status(400).json({ msg:'Token is not valid'});
	}
}

module.exports = auth;
