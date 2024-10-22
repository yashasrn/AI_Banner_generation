const Banner = require('../models/Banner');

exports.createBanner = async (req, res) => {
    const newBanner = new Banner(req.body);
    await newBanner.save();
    res.status(201).json(newBanner);
};
