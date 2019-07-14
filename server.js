const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const config = require('./config/Default');

const app = express();

app.use(express.json());

const db = config.mongoURI;

mongoose.connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then(() => console.log('mongoDB connected')).catch(err => console.log(err));

app.use('/api/items', require('./routes/api/items'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));

//Serve Static assets (build) if in production
if (process.env.NODE_ENV === 'production') {
    //set static folder for true
    app.use(express.static('client/build'));
    //Loading html
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    });
}

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started on ${port}`));