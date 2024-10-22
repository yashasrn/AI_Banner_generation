const express = require('express');
const router = express.Router();
const Banner = require('../models/Banner');

// Banner Generation
router.post('/generate', async (req, res) => {
  const { theme, text, fontStyle, image } = req.body;
  const userId = req.user.id; // Assuming user is authenticated

  try {
    const banner = new Banner({ theme, text, fontStyle, image, userId });
    await banner.save();
    res.json({ msg: 'Banner generated successfully' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
