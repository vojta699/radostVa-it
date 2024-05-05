const express = require("express");
const router = express.Router();

// Import ---------------------------------------------
const GetAbl = require("../abl/recipe/getAbl");
const ListAbl = require("../abl/recipe/listAbl");
const CreateAbl = require("../abl/recipe/createAbl");
const UpdateAbl = require("../abl/recipe/updateAbl");
const DeleteAbl = require("../abl/recipe/deleteAbl");
const AvgRatingAbl = require("../abl/recipe/avgRatingAbl");
// (./img/..)
const ImgUploadAbl = require("../abl/recipe/img/imgUploadAbl");
const ImgDeleteAbl = require("../abl/recipe/img/imgDeleteAbl");
const ImgGetAbl = require("../abl/recipe/img/imgGetAbl")
// (./sort/..)
const ListSortedByNameAbl = require("../abl/recipe/sort/listSortedByNameAbl");
const ListSortedByRatingAbl = require("../abl/recipe/sort/listSortedByRatingAbl");
const ListSortedByCountryAbl = require("../abl/recipe/sort/listSortedByCountryAbl");

// Routy ---------------------------------------------
router.get("/get/:id", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update/:recipeid/:userid", UpdateAbl);
router.post("/delete/:recipeid/:userid", DeleteAbl);
router.get("/avgRating/:recipeid", AvgRatingAbl);
// (./img/..)
router.post("/img/upload", ImgUploadAbl)
router.post("/img/delete/:fileName", ImgDeleteAbl)
router.get("/img/get/:fileName", ImgGetAbl)
// (./sort/..)
router.get("/sort/listSortedByName", ListSortedByNameAbl);
router.get("/sort/listSortedByRating", ListSortedByRatingAbl);
router.get("/sort/listSortedByCountry", ListSortedByCountryAbl);

module.exports = router;