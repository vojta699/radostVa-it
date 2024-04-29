const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/rating/createAbl");
const UpdateAbl = require("../abl/rating/updateAbl")
const AuthUserAbl = require("../abl/rating/authorisationAbl")

router.post("/create", AuthUserAbl, CreateAbl);
router.post("/update/:ratingid/:userid", AuthUserAbl, UpdateAbl)

module.exports = router;