const express = require('express');
const router = express.Router();
const { generateBanner } = require('../models/bannerModel');

router.post('/generate', async (req, res) => {
  const bannerData = req.body; // Assuming user input is in the request body
  const generatedBanner = await generateBanner(bannerData);
  res.json(generatedBanner);
});

module.exports = router;
