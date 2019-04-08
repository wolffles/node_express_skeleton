# Node/Express Skeleton
Basic node server with notes on things to add.
* checklist for project
  - package.json (change name)
  - npm install

## Node backend API returns JSON(webservices no rendering)

### Creating routes
  * In server.js file: use/uncomment sample route files and use Routes.
  * routes/api/<route_name>.js
  * sample route: 
```
const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => res.json({ msg: 'Dashboard Works' })); 


//@route    POST api/posts/comment/:post_id
//@desc     Add comment to post
//@access   Private
router.post('/comment/:post_id', passport.authenticate('jwt', {session: false}), (req,res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check validation
    if (!isValid) {
        // if any errors, send 400 with errors object
        return res.status(400).json(errors)
    }

    Post.findById(req.params.post_id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }
            // Add to comments array
            post.comments.unshift(newComment);

            //save
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
})
```

###Creating Authentication