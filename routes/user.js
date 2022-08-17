const router = require("express").Router();
const User = require("../models/User");
const {
	verifyTokenAndAuthorization,
	verifyTokenAndAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
	if (req.body.password) {
		req.body.password = CryptoJS.AES.encrypt(
			req.body.password,
			process.env.PASS_SECRET
		).toString();
	}

	try {
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json("User has been deleted!");
	} catch (er) {
		res.status(500).json(er);
	}
});

//GETUSER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id, "-password");

		res.status(200).json(user);
	} catch (er) {
		res.status(500).json(er);
	}
});

//GET ALL USER
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	const query = req.query.new;
	try {
		const users = query
			? await User.find({}, "-password").sort({ _id: -1 }).limit(5)
			: await User.find({}, "-password");

		res.status(200).json(users);
	} catch (er) {
		res.status(500).json(er);
	}
});

//GET USER STATE
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
	const date = new Date();
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
	try {
		const data = await User.aggregate([
			{ $match: { createdAt: { $gte: lastYear } } },
			{ $project: { month: { $month: "$createdAt" } } },
			{ $group: { _id: "$month", total: { $sum: 1 } } },
		]);
		res.status(200).json(data);
	} catch (er) {
		res.status(500).json(er);
	}
});

module.exports = router;
