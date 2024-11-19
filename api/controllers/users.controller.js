const Users = require('../model/users.model');
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
        const { email, password } = req.body;
        let user;
        user = await Users.findOne({ email: email });
        if (!user) {
            return res.status(200).json({ msg: false, message: 'User not found' });
        }
        if (!user.is_active) {
            return res.status(200).json({ msg: false, message: 'Your account has been locked. So contact to support team' });
        }
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                return res.status(200).json({ msg: false, message: 'Internal server error' });
            }

            if (result) {
                return res.status(200).json({ msg: true, message: 'User Data fetched', data: user });
            } else {
                return res.status(200).json({ msg: false, message: 'Invalid password' });
            }
        });
    } catch (error) {
        next(error);
    }
};

const errfunc = async (res) => {
    return res.status(200).json({ res_status: false, message: 'Something went wrong' });
}



