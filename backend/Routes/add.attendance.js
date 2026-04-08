const express = require("express");
const attendanceModel = require("../models/attendance.model");
const userModel = require("../models/user.model");
const router = express.Router();

router.post("/", async (req, res) => {
    const { name, model_id, date } = req.body;

    try {
        const user = await userModel.findOne({ model_id });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const attendance = await attendanceModel.create({
            userId: user._id,
            date
        });

        res.status(201).json({
            success: true,
            message: "Attendance added successfully",
            attendance
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding attendance",
            error: error.message
        });
    }
});

module.exports = router;
