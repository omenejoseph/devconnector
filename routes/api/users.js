const express = require('express');
const router = express.Router();

// @route   Get api/users/
// @desc    get all users
// @access  public 
router.get('/', (req, res) => res.json({
    msg: "Users Works"
}));

module.exports = router;