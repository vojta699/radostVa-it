const express = require("express");
const router = express.Router();

// Import
const { Country } = require("../helpers/enumCountry.js");
const { Units } = require("../helpers/enumUnit.js");
const { Roles } = require("../helpers/enumRoles.js");


// Routy
router.get('/country', (req, res) => {
    res.json(Object.values(Country));
});
router.get('/units', (req, res) => {
    res.json(Object.values(Units));
});
router.get('/roles', (req, res) => {
    res.json(Object.values(Roles));
});


module.exports = router;