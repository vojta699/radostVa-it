const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/recipe/getAbl");
const ListAbl = require("../abl/recipe/listAbl");
const CreateAbl = require("../abl/recipe/createAbl");
const UpdateAbl = require("../abl/recipe/updateAbl");
const DeleteAbl = require("../abl/recipe/deleteAbl");
const AvgRatingAbl = require("../abl/recipe/avgRatingAbl");
const AuthUserAbl = require("../abl/recipe/authorisationAbl")

// (./img/..)
const ImgUploadAbl = require("../abl/recipe/img/imgUploadAbl");
const ImgDeleteAbl = require("../abl/recipe/img/imgDeleteAbl");
const ImgGetAbl = require("../abl/recipe/img/imgGetAbl")

router.get("/get/:recipeid", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update/:recipeid/:userid", AuthUserAbl, UpdateAbl);
router.post("/delete/:recipeid/:userid", AuthUserAbl, DeleteAbl);
router.get("/avgRating/:recipeid", AvgRatingAbl);
// (./img/..)
router.post("/img/upload", ImgUploadAbl)
router.post("/img/delete/:fileName", ImgDeleteAbl)
router.get("/img/get/:fileName", ImgGetAbl)

module.exports = router;