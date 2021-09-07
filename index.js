const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');



app.set('view engine', 'ejs');
app.set('views', 'views');

mongoose.connect('mongodb://localhost:27017/authDemo', {useNewUrlParser: true})
.then(console.log('Connection to DB complete'))
.catch(err => {
    console.log('Your connection ran into a problem');
    console.log(err);
})

app.use(express.urlencoded({ extended : true }));
app.use(session({secret : 'notagoodsecret'}));

//simple check login middleware
const requireLogin = (req, res, next) => {
    if (!req.session.user_id) {
        return res.redirect('/login')
    }
    next();
}

app.get('/', (req, res) => {
    res.send('Welcome to the homepage')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const user = new User({username, password})
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const foundUser = await User.findAndValidate(username, password);
    if(foundUser) {
        req.session.user_id = foundUser._id;
        res.render('secret')
    } else {
        res.render('login')
    }
})

app.post('/logout', (req, res) => {
    req.session.user_id = null;
    res.redirect('/login')
})

app.get('/secret', requireLogin, (req, res) => {
    res.render('secret')
})

app.get('/topsecret', requireLogin, (req, res) => {
    res.send('top SECRET!')
})

app.listen(3000, () => {
    console.log('Listening on the port 3000')
})