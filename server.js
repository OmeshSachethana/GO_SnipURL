const express = require('express')
const mongoose = require('mongoose')
const app = express()
const port = 5000;

app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost/urlShortener', {
    useNewUrlParser: true, useUnifiedTopology: true
})

app.get('/', (req, res) => {
    res.render('index');
})
app.listen(process.env.PORT || port)