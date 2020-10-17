const jwt = require("jsonwebtoken");
const Sauce = require("../models/Sauces");

module.exports = (req, res, next) => {
	const token = req.headers.authorization.split(" ")[1];
	const decodedToken = jwt.verify(token, "Jtsr843aIc78adGa_korT2aN_171a00");
	const userId = decodedToken.userId;
	Sauce.findOne({ _id: req.params.id }).then((sauce) => {
		if (sauce.userId !== userId) {
			res.status(401).json({
				message: "opération non autorisée",
			});
		} else {
			next();
		}
	});
};
