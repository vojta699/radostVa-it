const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/recipe/getAbl");
const ListAbl = require("../abl/recipe/listAbl");
const CreateAbl = require("../abl/recipe/createAbl");
const UpdateAbl = require("../abl/recipe/updateAbl");
const DeleteAbl = require("../abl/recipe/deleteAbl");
const AvgRatingAbl = require("../abl/recipe/avgRatingAbl");

router.get("/get/:id", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update/:id", UpdateAbl);
router.post("/delete/:id", DeleteAbl);
router.get("/avgRating/:id", AvgRatingAbl);

module.exports = router;


