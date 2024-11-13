const Visitors = require('../model/visitor.model');

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
            default:
                errfunc(res);
                break;
        }

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

const errfunc = async (res) => {
    return res.status(200).json({ res_status: false, message: 'Something went wrong' });
}



