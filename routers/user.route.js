const express = require("express");
var shortid = require("shortid");

const db = require("../db");
const controller=require('../controllers/user.controller');
const router = express.Router();

router.get("/", controller.index);

router.get("/search", controller.search);

router.get("/create",controller.getCreate);

router.get("/:id", controller.getbyId);

router.post("/create", controller.postCreate);

module.exports = router;
