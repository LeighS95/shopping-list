const config = require('../config/Default');
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    const token = req.header('x-auth-token');

    //Check for Token
    if(!token) return res.status(401).json({ msg: 'No Token'});

    try {
        //Verify Token
        const decoded = jwt.verify(token, config.jwtSecret);
        //Add user from payload
        req.user = decoded;
        next();
    } catch(e) {
        res.status(400).json({ msg: 'Token Not Valid '})
    }
}

module.exports = auth;