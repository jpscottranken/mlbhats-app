//	We require the User model created previously.
const User = require("../models/User")

//	We require the jsonwebtoken to create the JSON Web Tokens
//	needed to verify whether a user has been authenticated.
const jwt = require("jsonwebtoken")

//	We require the config package to let us access the JSON
//	JWT secret code stored in the config folder.
const config = require("config")

//	We require the bcrypt library to hash the passwords before
//	saving them in the database.
const bcrypt = require("bcrypt")

//*************************************************************
//
//	Here is the first of our functions for authController.js
//	It handles user signup.
//
//*************************************************************

module.exports.signup = (req, res) => {
  //	Use object destructuring here
  const { name, email, password } = req.body

  //	Check whether any field is empty and if so, send a response
  //	with a message to fill out all fields.
  if (!name || !email || !password) {
    return res.status(400).json({ msg: "Please enter all fields" })
  }

  //	Search for a user with the provided email. If we find one in
  //	the database, return a response to the user to tell them that
  //	the email id already exists in the system.  The user should
  //	use a different email or log in with that email rather than
  //	registering.
  User.findOne({ email }).then((user) => {
    if (user) {
      return res.status(400).json({ msg: "User already exists" })
    }

    //	Generate a new user
    const newUser = new User({ name, email, password })

    //	Generate a salt and then hash the password using that salt.
    //	Then set the hashed value as the password and save the newUser
    //	instance to the database.
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          throw err
        }

        newUser.password = hash
        newUser.save().then((user) => {
          //	After saving the user to the database,
          //	create a signed JWT token to be stored in
          //	local storage. Create the token by providing
          //	the user id, a JWT secret and the expiry time.
          //	Then send the token as a response along with
          //	the user details without the password.
          jwt.sign(
            { id: user.id },
            config.get("jwtsecret"),
            { expiresIn: 3600 },
            (err, token) => {
              if (err) {
                throw err
              }

              res.json({
                token,
                user: {
                  id: user._id,
                  name: user.name,
                  email: user.email,
                },
              })
            }
          )
        })
      })
    })
  })
}

//*************************************************************
//
//	Here is the second of our functions for authController.js
//	It allows an already registered user to log into the application.
//
//*************************************************************

//	Deconstruct the request body to get the email and password.
module.exports.login = async (req, res) => {
  const { email, password } = req.body

  //	If either is absent, send a response to the user with
  //	a message stating must enter both email and password.
  if (!email || !password) {
    res.status(400).json({ msg: "Please enter all fields" })
  }

  //	Search for the user using the email. If the user does not
  //	exist, send a response stating the user does not exist in
  //	the database and he/she should register before logging in.
  User.findOne({ email }).then((user) => {
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" })
    }
    //	Compare provided password with the user password
    //	present in the database.
    //	The bcrypt compare function takes the provided password,
    //	hashes it and compares it to hashed password saved in the
    //	database. If they do not match, return a message regarding
    //	invalid credentials.
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" })
      //	Create a signed JWT token like in the signup function.
      //	Return the token with the user details without the password.
      jwt.sign(
        { id: user._id },
        config.get("jwtsecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err
          res.json({
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
            },
          })
        }
      )
    })
  })
}

//*************************************************************
//
//	Here is the third of our functions for authController.js
//	It finds a user by id and returns the user without the
//	password as the JSON response.
//
//*************************************************************

module.exports.get_user = (req, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then((user) => res.json(user))
}
