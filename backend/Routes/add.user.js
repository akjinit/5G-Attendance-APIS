const express = require("express");
const userModel = require("../models/user.model");

const router = express.Router();

router.post("/", async (req, res) => {
    const { name, model_id } = req.body;
    try {
        const user = userModel.create({
            name,
            model_id
        });

        res.status(201).json({
            success: true,
            message: "User added successfully",
            user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error adding user",
            error: error.message
        });
    }
});

module.exports = router;
