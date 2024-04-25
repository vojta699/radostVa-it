const express = require("express");
const router = express.Router();

const GetAbl = require("../abl/user/getAbl");
const ListAbl = require("../abl/user/listAbl");
const CreateAbl = require("../abl/user/createAbl");
const UpdateAbl = require("../abl/user/updateAbl");
const DeleteAbl = require("../abl/user/deleteAbl");

router.get("/get/:id", GetAbl);
router.get("/list", ListAbl);
router.post("/create", CreateAbl);
router.post("/update/:id", UpdateAbl);
router.post("/delete/:id", DeleteAbl);

module.exports = router;
