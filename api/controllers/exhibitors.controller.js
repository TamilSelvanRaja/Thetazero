const Exhibitors = require('../model/exhibitors.model');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);

/**
 * Exhibitors Functions
 * @public
 */
exports.exhibitorsfunctions = async (req, res, next) => {
    try {
        switch (req.body.service_id) {
            case "add_exhibitors":
                addExhibitors(req, res, next);
                break;
            default:
                errfunc(res);
                break;
        }

    } catch (error) {
        next(error);
    }
};

const addExhibitors = async (req, res, next) => {
    try {
        const hashedPassword = bcrypt.hashSync(req.body.passkey, salt);
        req.body.is_active = true;
        req.body.password = hashedPassword;
        const data = new Exhibitors(req.body);
        await data.save();
        return res.status(200).json({ msg: true, message: "Exhibitor successfully added", data: hashedPassword });
    } catch (error) {
        next(error);
    }
};

const errfunc = async (res) => {
    return res.status(200).json({ msg: false, message: 'Something went wrong' });
}



