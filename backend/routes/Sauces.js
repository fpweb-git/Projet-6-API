const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const idCheck = require("../middleware/idCheck");
const saucesCtrl = require("../controllers/Sauces");
const multer = require("../middleware/multer-config");

// add auth midlleware to secure item route
router.get("/", auth, saucesCtrl.getAllSauce);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.post("/", auth, multer, saucesCtrl.createSauce);
router.put("/:id", auth, idCheck, multer, saucesCtrl.modifySauce);
router.delete("/:id", auth, idCheck, saucesCtrl.deleteSauce);
router.post("/:id/like", auth, saucesCtrl.createSauceStatut);

module.exports = router;
