const express = require('express');
const router = express.Router();

// @route   Get api/profile/
// @desc    get user profile
// @access  protected 
router.get('/', (req, res) => res.json({
    msg: "Users Works"
}));

module.exports = router;