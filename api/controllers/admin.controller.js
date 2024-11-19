const Categories = require('../model/admin/category.model');
const Exhibitors = require('../model/admin/exhibitors.model');
const Events = require('../model/admin/events.model');

/**
 * Admin Functions
 * @public
 */
exports.adminfunctions = async (req, res, next) => {
    try {
        switch (req.body.service_id) {
            case "add_event":
                addEvent(req, res, next);
                break;
            case "get_current_event":
                getEvent(req, res, next);
                break;
            case "add_category":
                addCategory(req, res, next);
                break;
            case "get_category":
                getCategory(req, res, next);
                break;
            case "add_exhibitors":
                addExhibitors(req, res, next);
                break;
            case "get_exhibitors":
                getExhibitors(req, res, next);
                break;
            default:
                errfunc(res);
                break;
        }

    } catch (error) {
        next(error);
    }
};

const addEvent = async (req, res, next) => {
    try {
        req.body.is_active = true;
        const data = new Events(req.body);
        await data.save();
        return res.status(200).json({ msg: true, message: "Event successfully added" });
    } catch (error) {
        next(error);
    }
};

const getEvent = async (req, res, next) => {
    try {
        const responceData = await Events.findOne({
            is_active: true
        });
        if (responceData) {
            return res.status(200).json({ msg: true, message: "Events Data", data: responceData });
        } else {
            return res.status(200).json({ msg: false, message: "Not yet start event" });

        }
    } catch (error) {
        next(error);
    }
};

const addCategory = async (req, res, next) => {
    try {
        const totalList = await Categories.find();
        var total = totalList.length + 1;
        const refId = "cat_" + total;
        req.body.is_active = true;
        req.body.ref_id = refId;
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

const addExhibitors = async (req, res, next) => {
    try {

        const totalList = await Exhibitors.find();
        var total = totalList.length + 1;
        const stallid = "stall_" + total;
        req.body.is_active = true;
        req.body.stall_id = stallid;
        const data = new Exhibitors(req.body);
        await data.save();

        return res.status(200).json({ msg: true, message: "Exhibitor successfully added" });
    } catch (error) {
        next(error);
    }
};

const getExhibitors = async (req, res, next) => {
    try {
        const responceData = await Exhibitors.find({
            is_active: true
        });
        return res.status(200).json({ msg: true, message: "Successfully exhibitor list fetched", data: responceData });
    } catch (error) {
        next(error);
    }
};

const errfunc = async (res) => {
    return res.status(200).json({ msg: false, message: 'Something went wrong' });
}



