const express = require('express');
const router = express.Router();

// @route   Get api/posts/
// @desc    get all posts
// @access  public 
router.get('/', (req, res) => res.json({
    msg: "Users Works"
}));

module.exports = router;