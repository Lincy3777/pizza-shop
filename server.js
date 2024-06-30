const express = require('express');
const app = express();
const path = require('path');
const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');

const PORT = process.env.PORT || 3300;
// it will check the environment variable first if it doesnt find port var. then it will run on 3000

app.get('/', (req, res) => {
    res.render('home');
});//request on /                                                                                                                            

// set Template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
console.log(path.join(__dirname, '/resources/views'));
app.set('view engine', 'ejs');

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});