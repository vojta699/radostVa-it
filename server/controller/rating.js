const express = require("express");
const router = express.Router();

const CreateAbl = require("../abl/rating/createAbl");
const UpdateAbl = require("../abl/rating/updateAbl")

router.post("/create", CreateAbl);
router.post("/update/:id", UpdateAbl)

module.exports = router;