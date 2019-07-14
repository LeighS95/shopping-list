const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('../../config/Default.json');
const jwt = require('jsonwebtoken');

//User Model
const User = require('../../models/User')

//@route POST - gets all users (public)
router.post('/', (req, res) => {
    const { name, email, password } = req.body;

    if(!name || !email || !password) {
        return res.status(400).json({ msg: "Please Enter fields" });
    }

    User.findOne({ email }).then(user => {
        if(user) return res.status(400).json({ msg: "User Exists" });

        const newUser = new User({
            name,
            email,
            password
        });

        //Create Salt & hash (encrypt password)
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save().then(user => {

                    jwt.sign(
                        { id: user.id },
                        config.jwtSecret,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if(err) throw err;
                            res.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        }
                    )
                });
            })
        })
    })
});


module.exports = router;