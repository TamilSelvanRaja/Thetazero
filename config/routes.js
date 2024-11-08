const express = require('express');
const router = express.Router();
const usercontroller = require('../controller/users.controller');
const eventcontroller = require('../controller/events.controller');
const appointmentcontroller = require('../controller/appointment.controller');

router.get("/", (req, res) => res.send("Token Not Verified"));
router.get("/servertest", (req, res) => res.send("Server running..."));

//*****************************************************************************\\
//********************* Exhibitors & Organizations Routes *********************\\
//*****************************************************************************\\
router.post("/adminlogin", usercontroller.adminlogin);
router.post("/memberlogin", usercontroller.memberlogin);
router.get("/exhibitors", usercontroller.exhibitors);
router.get("/getVisitorId", usercontroller.visitors);
router.get("/exhibitorData", usercontroller.getExhibitorsDetails);

//*****************************************************************************\\
//************************** Events Related Routes ****************************\\
//*****************************************************************************\\
router.get("/eventdates", eventcontroller.eventdates);
router.get("/categories", eventcontroller.categories);
router.get("/timeslots", eventcontroller.timeslots);
router.post("/submitForm", eventcontroller.submitForm);
router.post("/memberform", eventcontroller.submitForm);
router.get("/calendarData", eventcontroller.calendarData);

//*****************************************************************************\\
//********************* Appointment Management Routes *************************\\
//*****************************************************************************\\
router.get("/getAppointmentStatus/:appointmentId",appointmentcontroller.getAppointment);
router.post("/approveVisitor", appointmentcontroller.approveVisitor);
router.post("/rejectVisitor", appointmentcontroller.rejectVisitor);
router.post("/rescheduleVisitor", appointmentcontroller.rescheduleVisitor);
router.get("/appointmentData", appointmentcontroller.appointmentData);

module.exports = router;