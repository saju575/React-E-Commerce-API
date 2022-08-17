const router = require("express").Router();
const Cart = require("../models/Cart");
const {
	verifyTokenAndAdmin,
	verifyToken,
	verifyTokenAndAuthorization,
} = require("./verifyToken");

//CREATE

router.post("/", verifyToken, async (req, res) => {
	const newCart = new Cart(req.body);
	try {
		const savedCart = await newCart.save();
		res.status(200).json(savedCart);
	} catch (er) {
		res.status(500).json(er);
	}
});

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
	try {
		const updatedCart = await Cart.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedCart);
	} catch (err) {
		res.status(500).json(err);
	}
});

// // //DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
	try {
		await Cart.findByIdAndDelete(req.params.id);
		res.status(200).json("Cart items has been deleted!");
	} catch (er) {
		res.status(500).json(er);
	}
});

// //GET USER CART
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
	try {
		const cart = await Cart.findOne({ userId: req.params.userId });

		res.status(200).json(cart);
	} catch (er) {
		res.status(500).json(er);
	}
});

// // //GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	try {
		const carts = await Cart.find();
		res.status(200).json(carts);
	} catch (er) {
		res.status(500).json(er);
	}
});

module.exports = router;
