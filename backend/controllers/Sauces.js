const Sauce = require("../models/Sauces");
const fs = require("fs");

exports.getAllSauce = (req, res, next) => {
	Sauce.find()
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauces) => res.status(200).json(sauces))
		.catch((error) => res.status(404).json({ error }));
};

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);
	delete sauceObject._id;
	const sauce = new Sauce({
		...sauceObject,
		imageUrl: `${req.protocol}://${req.get("host")}/images/${
			req.file.filename
		}`,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: [],
	});
	sauce
		.save()
		.then(() => res.status(201).json({ message: "Sauce créé !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
	const sauceObject = req.file
		? {
				...JSON.parse(req.body.sauce),
				imageUrl: `${req.protocol}://${req.get("host")}/images/${
					req.file.filename
				}`,
		  }
		: { ...req.body };
	Sauce.updateOne(
		{ _id: req.params.id },
		{ ...sauceObject, _id: req.params.id }
	)
		.then(() => res.status(200).json({ message: "Sauce modifié !" }))
		.catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then((sauce) => {
			const filename = sauce.imageUrl.split("/images/")[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() =>
						res.status(200).json({ message: "Sauce supprimé !" })
					)
					.catch((error) => res.status(400).json({ error }));
			});
		})
		.catch((error) => res.status(500).json({ error }));
};

// Like feature
exports.createSauceStatut = (req, res, next) => {
	switch (req.body.like) {
		//case like = 0
		case 0:
			// get access to the collection
			Sauce.findOne({ _id: req.params.id })
				.then((sauce) => {
					// Check if the user allready like the sauce
					if (sauce.usersLiked.includes(req.body.userId)) {
						//update information in db
						Sauce.updateOne(
							{ _id: req.params.id },
							{
								$inc: { likes: -1 },
								$pull: { usersLiked: req.body.userId },
							}
						)
							.then(() => {
								res.status(201).json({
									message: "like retiré",
								});
							})
							.catch((error) => {
								res.status(400).json({ error });
							});
					}
					// Check if the user allready dislike the sauce
					if (sauce.usersDisliked.includes(req.body.userId)) {
						Sauce.updateOne(
							{ _id: req.params.id },
							{
								$inc: { dislikes: -1 },
								$pull: { usersDisliked: req.body.userId },
							}
						)
							.then(() => {
								res.status(201).json({
									message: "dislike retiré",
								});
							})
							.catch((error) => {
								res.status(400).json({ error });
							});
					}
				})
				.catch((error) => {
					res.status(404).json({ error });
				});
			break;
		//case like = 1
		case 1:
			Sauce.updateOne(
				{ _id: req.params.id },
				{
					$inc: { likes: 1 },
					$push: { usersLiked: req.body.userId },
					_id: req.params.id,
				}
			)
				.then(() => {
					res.status(201).json({
						message: "like ajouté",
					});
				})
				.catch((error) => {
					res.status(400).json({ error });
				});
			break;
		//case like = -1
		case -1:
			Sauce.updateOne(
				{ _id: req.params.id },
				{
					$inc: { dislikes: 1 },
					$push: { usersDisliked: req.body.userId },
					_id: req.params.id,
				}
			)
				.then(() => {
					res.status(201).json({
						message: "dislike ajouté",
					});
				})
				.catch((error) => {
					res.status(400).json({ error });
				});
			break;
		default:
			console.log("une erreur s'est produite");
	}
};
