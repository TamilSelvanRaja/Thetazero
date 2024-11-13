const Categories = require('../model/admin/category.model');


/**
 * Admin Functions
 * @public
 */
exports.adminfunctions = async (req, res, next) => {
    try {
        switch (req.body.service_id) {
            case "add_category":
                addCategory(req, res, next);
                break;
            case "get_category":
                getCategory(req, res, next);
                break;
            default:
                errfunc(res);
                break;
        }

    } catch (error) {
        next(error);
    }
};

const addCategory = async (req, res, next) => {
    try {
        req.body.is_active = true;
        const data = new Categories(req.body);
        await data.save();
        return res.status(200).json({ msg: true, message: "Cateogry successfully added" });
    } catch (error) {
        next(error);
    }
};


const getCategory = async (req, res, next) => {
    try {
        const responceData = await Categories.find({
            is_active: true
        });
        return res.status(200).json({ msg: true, message: "Successfully category list fetched", data: responceData });
    } catch (error) {
        next(error);
    }
};

const errfunc = async (res) => {
    return res.status(200).json({ msg: false, message: 'Something went wrong' });
}



