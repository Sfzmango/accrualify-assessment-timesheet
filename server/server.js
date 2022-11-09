// declaring required dependencies
const express = require('express');
const path = require('path');
const db = require('./config/connection');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// declaring routes
app.get('/', (req, res) => {
    res.send('this is the home route');
});

app.get('/login', (req, res) => {
    res.send('this is the login route');
});

app.listen(PORT, () => {
    console.log('App running on PORT: ', PORT);
})