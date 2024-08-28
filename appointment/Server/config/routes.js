const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/users.controller');

router.get("/", (req, res) => res.send("Token Not Verified"));

router.post("/adminlogin", usercontroller.adminlogin);
router.post("/memberlogin", usercontroller.memberlogin);
router.get("/exhibitors", usercontroller.exhibitors);
router.get("/getVisitorId", usercontroller.visitors);
router.get("/exhibitorData", usercontroller.getExhibitorsDetails);
router.get("/eventdates", (req, res) => res.send("Token"));
router.get("/categories", (req, res) => res.send("Token"));
router.get("/timeslots", (req, res) => res.send("Token"));
router.post("/submitForm", (req, res) => res.send("Token"));
router.post("/memberform", (req, res) => res.send("Token"));
router.get("/calendarData", (req, res) => res.send("Token"));
router.get("/getAppointmentStatus/:appointmentId", (req, res) => res.send("Token"));
router.post("/approveVisitor", (req, res) => res.send("Token"));
router.post("/rejectVisitor", (req, res) => res.send("Token"));
router.post("/rescheduleVisitor", (req, res) => res.send("Token"));
router.get("/appointmentData", (req, res) => res.send("Token"));

module.exports = router;