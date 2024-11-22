const Users = require('../model/users.model');
const Visitors = require('../model/visitor.model');
const Appointment = require('../model/appointment.model');
const SubAppointment = require('../model/appointment_sub.model');
const Exhibitors = require('../model/admin/exhibitors.model');

const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

const { dummydata } = require('./dummydata');
/**
 * Users Functions
 * @public
 */
exports.userfunctions = async (req, res, next) => {
    try {
        switch (req.body.service_id) {
            case "add_user":
                addUser(req, res, next);
                break;
            case "user_login":
                login(req, res, next);
                break;
            case "get_appointments":
                getAppointments(req, res, next);
                break;
            case "approve_appointments":
                approveAppointment(req, res, next);
                break;
            case "reject_appointments":
                rejectAppointment(req, res, next);
                break;
            case "reschedule_appointments":
                rescheduleAppointment(req, res, next);
                break;
            default:
                errfunc(res);
                break;
        }

    } catch (error) {
        next(error);
    }
};

const addUser = async (req, res, next) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.passkey, salt);
        req.body.is_active = true;
        req.body.password = hashedPassword;
        const data = new Users(req.body);
        await data.save();
        return res.status(200).json({ res_status: true, message: "New Visitors added." });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password, type } = req.body;
        let user;
        user = await Users.findOne({ email: email });
        if (!user) {
            return res.status(200).json({ res_status: false, message: 'User not found' });
        }
        if (!user.is_active) {
            return res.status(200).json({ res_status: false, message: 'Your account has been locked. So contact to support team' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(200).json({ res_status: false, message: 'Internal server error' });
            }
            if (result) {
                return res.status(200).json({ res_status: true, message: 'User Data fetched', data: user });
            } else {
                return res.status(200).json({ res_status: false, message: 'Invalid password' });
            }
        });
    } catch (error) {
        next(error);
    }
};

const getAppointments = async (req, res, next) => {
    try {
        const { exhibitor_id } = req.body;
        var exhibitor = await Exhibitors.findOne({ _id: exhibitor_id, is_active: true })
        var appointmentsList = await SubAppointment.find({ exhibitor_id: exhibitor_id, is_active: true });

        var respoceData = [];
        for (var item of appointmentsList) {
            var returnData = {};
            const mainAppointment = await Appointment.findOne({ _id: item.appointment_id });
            const visitor = await Visitors.findOne({ _id: mainAppointment.visitor_id });

            returnData._id = item._id;
            returnData.organization = exhibitor.name;
            returnData.appointment_id = item.appointment_id;
            returnData.visitor_id = mainAppointment.visitor_id;
            returnData.visitor_name = visitor.name;
            returnData.app_date = item.app_date;
            returnData.app_time = item.app_time;
            returnData.status = item.status;
            returnData.note = mainAppointment.note;
            respoceData.push(returnData);
        };

        return res.status(200).json({ res_status: true, message: "Successfully appointment list fetched", data: respoceData });

    } catch (error) {
        next(error);
    }
};


const approveAppointment = async (req, res, next) => {
    try {
        const { user_id, sub_app_id, user_type } = req.body;

        const filter = { _id: sub_app_id };
        const updateDoc = {
            $set: {
                status: "Approved",
                updated_by: user_id,
                updater_type: user_type
            }
        };
        const responceData = await SubAppointment.findOneAndUpdate(filter, updateDoc, { returnDocument: 'after' });

        return res.status(200).json({ res_status: true, message: "Successfully approve the appointment", data: responceData });
    } catch (error) {
        next(error);
    }
};

const rejectAppointment = async (req, res, next) => {
    try {
        const { user_id, user_type, reject_reason, sub_app_id } = req.body;

        const filter = { _id: sub_app_id };
        const updateDoc = {
            $set: {
                status: "Rejected",
                is_active: false,
                updated_by: user_id,
                updater_type: user_type,
                reject_reason: reject_reason
            }
        };
        const responceData = await SubAppointment.findOneAndUpdate(filter, updateDoc, { returnDocument: 'after' });

        return res.status(200).json({ res_status: true, message: "Successfully reject the appointment", data: responceData });
    } catch (error) {
        next(error);
    }
};


const rescheduleAppointment = async (req, res, next) => {
    try {
        const { sub_app_id, user_id, user_type, app_time, app_date } = req.body;

        const filter = { _id: sub_app_id };
        const updateDoc = {
            $set: {
                status: "Rescheduled",
                updated_by: user_id,
                updater_type: user_type,
                app_time: app_time,
                app_date: app_date
            }
        };
        const responceData = await SubAppointment.findOneAndUpdate(filter, updateDoc, { returnDocument: 'after' });
        return res.status(200).json({ res_status: true, message: "Successfully update reschedule the appointment", data: responceData });
    } catch (error) {
        next(error);
    }
};


const errfunc = async (res) => {
    return res.status(200).json({ res_status: false, message: 'Something went wrong' });
}



