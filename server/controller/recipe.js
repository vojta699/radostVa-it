const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/recipe/getAbl");
const ListAbl = require("../abl/recipe/listAbl");
const CreateAbl = require("../abl/recipe/createAbl");
const UpdateAbl = require("../abl/recipe/updateAbl");
const DeleteAbl = require("../abl/recipe/deleteAbl");
const AvgRatingAbl = require("../abl/recipe/avgRatingAbl");
// (./img/..)
const UploadAbl = require("../abl/recipe/img/imgUploadAbl");
const ImgDeleteAbl = require("../abl/recipe/img/imgDeleteAbl");

router.get("/get/:id", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update/:id", UpdateAbl);
router.post("/delete/:id", DeleteAbl);
router.get("/avgRating/:id", AvgRatingAbl);
// (./img/..)
router.post("/img/upload", UploadAbl)
router.post("/img/delete/:fileName", ImgDeleteAbl)

module.exports = router;