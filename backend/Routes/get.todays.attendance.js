const express = require("express");
const attendanceModel = require("../models/attendance.model");
const userModel = require("../models/user.model");
const router = express.Router();


router.get('/', async (req, res) => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const attendance = await attendanceModel.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });
        const users = await userModel.find();
        //{name : Akshat , model_id : 123 , date : 2026-04-03, time : 10:00 AM, status : present}
        const attendanceData = users.map(user => {
            const attendance = attendance.find(att => att.userId.toString() === user._id.toString());
            return {
                name: user.name,
                model_id: user.model_id,
                date: attendance ? attendance.date.toDateString() : "Not Present",
                time: attendance ? attendance.date.getHours() + ":" + attendance.date.getMinutes() : "Not Present",
                status: attendance ? "Present" : "Not Present"
            };
        });
        res.status(200).json({
            success: true,
            message: "Attendance fetched successfully",
            attendanceData
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching attendance",
            error: error.message
        });
    }
});

module.exports = router;