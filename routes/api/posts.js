const express = require('express');
const router = express.Router();
const passport = require("passport");

const User = require("../../models/User");
const Post = require("../../models/Post");
const Profile = require("../../models/Profile");
const validatePostInput = require("../../validation/post");

// @route   Get api/posts/
// @desc    get all posts
// @access  public 
router.get('/', (req, res) => {
    Post
        .find()
        .sort("-date")
        .then(posts => {
            if (!posts) res.status(404).json({
                noPosts: "No Posts not found"
            })
            return res.json(posts)
        })
        .catch(err => res.status(500).json({
            error: "Something went wrong"
        }));
});
// @route   Get api/posts/:post_id
// @desc    get post by id
// @access  public 
router.get('/:post_id', (req, res) => {
    Post
        .findById(req.params.post_id)
        .then(post => res.json(post))
        .catch(err => res.status(404)
            .json({
                noPosts: "Post not found"
            }));
});
// @route   Post api/posts/
// @desc    Create posts
// @access  private 
router.post('/', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body);
    if (!isValid) return res.status(400).json(errors);

    const newPost = new Post({
        text: req.body.text,
        user: req.user.id,
        name: req.body.name,
        avatar: req.body.avatar
    });
    newPost
        .save()
        .then((post) => res.json(post))
        .catch(err => res.status(500)({
            error: "Something went wrong"
        }))

});
// @route   Delete api/posts/:post_id
// @desc    Delete post by id
// @access  private 
router.delete('/:post_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile
        .findOne({
            user: req.user.id
        })
        .then((profile) => {
            Post
                .findById(req.params.post_id)
                .then(post => {
                    if (post.user.toString() !== req.user.id)
                        return res.status(401).json({
                            notauthorized: "User not Authorized"
                        })
                    post
                        .remove()
                        .then(() => res.json({
                            success: true
                        }))
                        .catch(err => res.status(404).json({
                            noPosts: "Post not found"
                        }))
                }).catch(err => res.status(500).json(err));
        }).catch(err => res.status(500).json(err));
});

// @route   Post api/posts/like/:post_id
// @desc    Like post by id
// @access  private 
router.post('/like/:post_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile
        .findOne({
            user: req.user.id
        })
        .then((profile) => {
            Post
                .findById(req.params.post_id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {

                        return res.status(400).json({
                            alreadyliked: "User Already liked this post"
                        })
                    }
                    post
                        .likes
                        .unshift({
                            user: req.user.id
                        });
                    post
                        .save()
                        .then(post => res.json(post))
                        .catch(err => res.status(500).json(err))
                }).catch(err => res.status(500).json(err));
        }).catch(err => res.status(500).json(err));
});

// @route   Post api/posts/unlike/:post_id
// @desc    Dislike post by id
// @access  private 
router.post('/unlike/:post_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    Profile
        .findOne({
            user: req.user.id
        })
        .then((profile) => {
            Post
                .findById(req.params.post_id)
                .then(post => {
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length !== 0) {
                        const removeIndex = post
                            .likes
                            .map(item => item.user.toString())
                            .indexOf(req.user.id)
                        post
                            .likes
                            .splice(removeIndex, 1);
                        post
                            .save()
                            .then(post => res.json(post))
                            .catch(err => res.status(500).json(err))
                    } else
                        return res.status(400).json({
                            notliked: "Cannot dislike post not previously liked"
                        })

                }).catch(err => res.status(500).json(err));
        }).catch(err => res.status(500).json(err));
});
// @route   Post api/posts/comment/:post_id
// @desc    Add comment post by id
// @access  private 
router.post('/comment/:post_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    const {
        errors,
        isValid
    } = validatePostInput(req.body);
    if (!isValid) return res.status(400).json(errors);
        Post
            .findById(req.params.post_id)
            .then(post => {
                const newComment = {
                    text: req.body.text,
                    name: req.body.name,
                    avatar: req.body.avatar,
                    user: req.user.id
                }
                post.comments.unshift(newComment);
                post
                    .save()
                    .then(post => res.json(post))
                    .catch(err => res.status(400).json({
                        postnotfound: "No Post found"
                    }))
                
            }).catch(err => res.status(500).json(err));
        
});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete comment post by post and comment id
// @access  private 
router.delete('/comment/:post_id/:comment_id', passport.authenticate('jwt', {
    session: false
}), (req, res) => {
        Post
            .findById(req.params.post_id)
            .then(post => {
                if(post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0){
                    return res.status(404).json({
                        commentnotexist: "Comment does not exist"
                    })
                } else {
                    //find comment
                    const comment = post
                        .comments
                        .filter(comment => comment._id.toString() === req.params.comment_id);
                        //check if authurized user created the comment
                        if(comment[0].user == req.user.id){
                            //find index and splice
                            const removeIndex = post
                                .comments
                                .map(item => item.user.toString())
                                .indexOf(req.user.id);
                                post.comments.splice(removeIndex, 1);
                                //save post
                                post
                                    .save()
                                    .then(post => res.json(post))
                                    .catch(err => res.status(404).json({
                                        commentnotfound: "Comment does not exist"
                                    }))
                        } else {
                            return res.status(401).json({
                                notauthorized: "User not Authorized"
                            })
                        }
                    
                }
      
            }).catch(err => res.status(500).json(err));
        
});


module.exports = router;