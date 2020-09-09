const User = require("../models/User");

exports.createUser = (req, res, next) => {
	const user = new User({
		...req.body,
	});
	user.save()
		.then(() => res.status(201).json({ message: "Compte créé" }))
		.catch((error) => res.status(400).json({ error }));
};
