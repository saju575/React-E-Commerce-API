const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
app.use(cors());

const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const paymentRoute = require("./routes/stripe");
app.use(express.json());
dotenv.config();
const URL = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dzsfuut.mongodb.net/shop?retryWrites=true&w=majority`;

mongoose
	.connect(URL)
	.then(() => console.log("DBconnection successfull"))
	.catch((err) => console.log(err));

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", paymentRoute);

app.listen(process.env.PORT || 5000, () => {
	console.log("Backend server is runing..");
});

// E - Commerce;
// cDa1wLxSwVT7aRjl;
