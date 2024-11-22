const Visitors = require('../model/visitor.model');
const Appointment = require('../model/appointment.model');
const SubAppointment = require('../model/appointment_sub.model');
const Exhibitors = require('../model/admin/exhibitors.model');

/**
 * Visitors Functions
 * @public
 */
exports.visitorfunctions = async (req, res, next) => {
    try {
        switch (req.body.service_id) {
            case "add_member":
                addMember(req, res, next);
                break;
            case "login_member":
                login(req, res, next);
                break;
            case "book_appointment":
                bookAppointment(req, res, next);
                break;
            case "get_appointment":
                getAppointment(req, res, next);
                break;
            default:
                errfunc(res);
                break;
        }

    } catch (error) {
        next(error);
    }
};

const addMember = async (req, res, next) => {
    try {
        req.body.is_active = true;
        const data = new Visitors(req.body);
        await data.save();
        return res.status(200).json({ res_status: true, message: "New Visitors added." });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        let visitor = await Visitors.findOne({
            mobile: req.body.mobile
        });

        if (!visitor) {
            return res.status(200).json({ res_status: false, message: 'User not found' });
        } else {
            if (!visitor.is_active) {
                return res.status(200).json({ res_status: false, message: "Your account has been locked. So contact to support team" });
            } else {
                const responceData = {
                    "_id": visitor._id,
                    "name": visitor.name,
                    "mobile": visitor.mobile
                }
                return res.status(200).json({ res_status: true, message: "Successfully Login", data: responceData });
            }

        }

    } catch (error) {
        next(error);
    }
};

const bookAppointment = async (req, res, next) => {
    try {
        req.body.is_active = true;
        const data = new Appointment(req.body);
        const saveData = await data.save();
        const appointmentsList = JSON.parse(req.body.appointments);
        appointmentsList.forEach(async (element) => {
            element.appointment_id = saveData._id;
            element.app_date = req.body.app_date;
            element.is_active = true;
            element.status = "New"
            const elementSave = new SubAppointment(element);
            await elementSave.save();
        });

        return res.status(200).json({ res_status: true, message: "Appointment Booking Successfully" });
    } catch (error) {
        next(error);
    }
};

const getAppointment = async (req, res, next) => {
    try {
        const { sub_app_id } = req.body;

        const sub_appointment = await SubAppointment.findOne({ _id: sub_app_id, is_active: true, status: "Rescheduled" });

        if (sub_appointment) {
            var exhibitor = await Exhibitors.findOne({ _id: sub_appointment.exhibitor_id, is_active: true })
            const main_appointment = await Appointment.findOne({ _id: sub_appointment.appointment_id, is_active: true });
            const visitor = await Visitors.findOne({ _id: main_appointment.visitor_id });
            const respoceData = {
                _id: sub_app_id,
                organization: exhibitor.name,
                appointment_id: sub_appointment.appointment_id,
                visitor_id: main_appointment.visitor_id,
                visitor_name: visitor.name,
                app_date: sub_appointment.app_date,
                app_time: sub_appointment.app_time,
                note: main_appointment.note,
            };
            return res.status(200).json({ res_status: true, message: "Appointment Booking Successfully", data: respoceData });

        } else {
            return res.status(200).json({ res_status: false, message: "Appointment status unable to fetch" });
        }
    } catch (error) {
        next(error);
    }
};

const errfunc = async (res) => {
    return res.status(200).json({ res_status: false, message: 'Something went wrong' });
}



