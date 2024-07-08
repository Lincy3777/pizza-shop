
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const session = require('express-session');
const flash = require('express-flash');

const PORT = process.env.PORT || 3300;
// it will check the environment variable first; if it doesn't find PORT, then it will run on 3300
const MongoDbStore = require('connect-mongo');
const mongoose = require('mongoose');

// Database connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url)
.then(() => { // Similar to an event listener
    console.log('Database connected..');
})
.catch(err => {
    console.log('Connection failed..', err);
});

// Session store
let mongoStore = MongoDbStore.create({
    mongoUrl: url, // Changed from 'connection' to 'url'
    collectionName: 'sessions' // Corrected the option name to 'collectionName'
});

// Session config
app.use(session({
    // To encrypt the cookie we use secret
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store: mongoStore,
    saveUninitialized: false, // Fixed typo here
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // Generated cookie will be alive for 24 hours
}));

app.use(flash());

// Set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
console.log(path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

// Assets
app.use(express.static('public'));
app.use(express.json());

//Global middleware
app.use((req, res ,next) =>{
    res.locals.session = req.session;
    next();//to continue process , else it will hang
})

require('./routes/web')(app); // app is passed here, thus received in web.js function

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
