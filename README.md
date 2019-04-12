# Node/Express Skeleton
Basic node server with notes on things to add.
### TODO LIST
* add post routes models

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
router.post('/comment/:post_id', passport.authenticate('jwt', {session: false}), (req,res) => { // session false because we aren't creating sessions but using tokens
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

### Setting up Schema for Mongo
 * models/Users.js (convention for model files are capitalized)
 * example of a schema:
 ```
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//We're making a post model where if user deletes post the comments don't delete unless user deletes it.

//Create Schema
const PostSchema = new Schema({
    user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    likes: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            }
        }
    ],
    comments: [
        {
            user: {
                type: Schema.Types.ObjectId,
                ref: 'users'
            },
            text: {
                type: String,
                required: true
            },
            name: {
                type: String
            },
            avatar: {
                type: String
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ]
});
// exporting a variable called Post its a mongoose model( , schema)
module.exports = Post = mongoose.model('post', PostSchema);

 ```

### Validation

### Creating Authentication and Registration
* if haven't yet install:
  - gravatar for profile ID.
  - passport for JWT validation
  - passport-jwt for info extraction
  - Jsonwebtoken for creating current user 
  - bcryptjs
* create the route file or use existing route (see routes section)
* load/require models if needed.
* require dependency libraries.
* create the route for: registration, login, current
* add middleware for passport to server file
* add a strategy for passport middleware in config/passport.js
* create the validation files.
* sample users route with registration file. 

  ```
const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys')
const passport = require('passport')

//Load Input Validation
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require("../../validation/login");

//load User model
const User = require('../../models/User');

//@route    POST api/users/test
//@desc     Register user
//@access   public
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);

    // Check Validation if isValid is false isValid checks if its empty so if not empty
    if(!isValid){
        return res.status(400).json(errors); //status code 400 is bad request.
    }

    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                return res.status(400).json({email: 'Email already exists'});
            } else {
                     const avatar = gravatar.url(
                       req.body.email,
                       {
                         s: "200", // Size
                         r: "pg", //rating
                         d: "mm" //Default
                       }
                     );
                     // avatar: avatar in es6 you can just put 1 if they're the same
                     const newUser = new User({
                       name: req.body.name,
                       email: req.body.email,
                       avatar, // avatar: avatar
                       password: req.body.password
                     });

                     bcrypt.genSalt(10, (err, salt) => {
                       bcrypt.hash(
                         newUser.password,
                         salt,
                         (err, hash) => {
                           if (err) console.log(err);
                           newUser.password = hash;
                           newUser
                             .save()
                             .then(user => res.json(user))
                             .catch(err => console.log(err));
                         }
                       );
                     });
                   }
        });
});


//@route    POST api/users/login
//@desc     Login user/ returning JWT Token
//@access   public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body);

    // Check Validation if isValid is false isValid checks if its empty so if not empty
    if (!isValid) {
        return res.status(400).json(errors); //status code 400 is bad request.
    }

    const email = req.body.email;
    const password = req.body.password;

    // Find user by email
    User.findOne({email: email}).then(user => {
        //check for user
        if(!user){
            errors.email = 'User not found'
            return res.status(404).json({email: "User not found"}); //404 means resource not found. )
        }

        //check password
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if(isMatch) {
                    // User matched

                    const payload = {
                        id: user.id,
                        name: user.name,
                        avatar: user.avatar
                    } // create JWT payload

                    // Signed Token
                    jwt.sign(
                        payload,
                        keys.secretOrKey,
                        { expiresIn: 3600 },
                        (err, token) => {
                            res.json({
                                success: true,
                                token: 'Bearer ' + token
                            })
                        }
                        );
                } else {
                    errors.password = 'Password incorrect';
                    return res.status(400)
                    .json(errors);
                }
            });

    });
});

//@route    GET api/users/current
//@desc     Returns current user
//@access   Private
router.get('/current', 
    passport.authenticate('jwt',
    {session: false}),
    (req,res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        })
})

module.exports = router;
  ```




