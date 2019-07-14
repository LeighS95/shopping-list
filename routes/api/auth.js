const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const config = require('../../config/Default.json');
const jwt = require('jsonwebtoken');
const auth = require('../../middleware/auth');


//User Model
const User = require('../../models/User')

//@route POST - api/auth - auth user
router.post('/', (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        return res.status(400).json({ msg: 'Please Enter fields' });
    }

    User.findOne({ email }).then(user => {
        if(!user) return res.status(400).json({ msg: 'User Does Not Exists'});

        //Validate password (encrypt password)
        bcrypt.compare(password, user.password).then(isMatch => {
            if(!isMatch) return res.status(400).json({ msg: 'Invalid User'});

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
        })
        
    })
});

//@route GET api/auth/user - get user data (private)
router.get('/user', auth, (req, res) => {
    User.findById(req.user.id).select('-password').then(user => res.json(user));
})

module.exports = router;