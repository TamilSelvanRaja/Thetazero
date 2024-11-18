const express = require('express');
const router = express.Router();
const { createSingleFileUploadStrategy } = require("./config/multerconfig");

const admincontroller = require('./api/controllers/admin.controller');
const visitorcontroller = require('./api/controllers/visitor.controller');
router.get("/", (req, res) => res.send("Token Not Verified"));

router.post("/admin", createSingleFileUploadStrategy('file'), admincontroller.adminfunctions);
router.post("/visitors", createSingleFileUploadStrategy('file'), visitorcontroller.visitorfunctions);

module.exports = router;