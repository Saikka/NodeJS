const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://boo:123@cluster0-gtms9.mongodb.net/scores';

const routes = require('./routes/scoreboard');
const errorController = require('./controllers/error');

const app = express();
app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

app.use(errorController.get404);

app.use((error, req, res, next) => {
    res.redirect('/500');
});

mongoose.connect(MONGODB_URI)
    .then(() => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });