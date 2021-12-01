const express = require("express")
const mongoose = require("mongoose")
const path = require("path")
const config = require("config")

const authRoutes = require('./routes/auth');
const itemRoutes = require('./routes/item');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');

const app = express()

app.use(express.json())
app.use('/api', authRoutes);
app.use('/api', itemRoutes);
app.use('/api', cartRoutes);
app.use('/api', orderRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"))
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  })
}

//DB = "mongodb+srv://user1:iFL4mA4jRSGGYWHg@sandbox.xd2pm.mongodb.net/hatsdb"

const dbURI = config.get("dbURI")

const port = process.env.port || 4000

//  Attempt to connect to DB
mongoose
  .connect(dbURI, 
			{
				useNewUrlParser: true, 
				useUnifiedTopology: true
			}
		)
  .then(() => app.listen(port, () => console.log(`Server running on http://localhost:${port}`)))
  .catch((err) => console.log(err));
