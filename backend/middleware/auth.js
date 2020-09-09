const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
	try {
		const token = req.headers.authorization.split(" ")[1];
		const decodedToken = jwt.verify(
			token,
			"Jtsr843aIc78adGa_korT2aN_171a00"
		);
		const userId = decodedToken.userId;
		if (req.body.userId && req.body.userId !== userId) {
			throw "ID utilisateur non valide";
		} else {
			next();
		}
	} catch {
		res.status(401).json({
			error: new Error("Mauvaise requête"),
		});
	}
};
