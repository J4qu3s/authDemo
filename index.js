const express = require('express');
const app = express();
const User = require('./models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

app.set('view engine', 'ejs');
app.set('views', 'views');

mongoose.connect('mongodb://localhost:27017/authDemo', {useNewUrlParser: true})
.then(console.log('Connection to DB complete'))
.catch(err => {
    console.log('Your connection ran into a problem');
    console.log(err);
})

app.use(express.urlencoded({ extended : true }));

app.get('/', (req, res) => {
    res.send('Welcome to the homepage')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 12);
    const user = new User({
        username,
        password : hash
    })
    await user.save();
    res.redirect('/')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username});
    const validPassword = await bcrypt.compare(password, user.password);
    if(validPassword) {
        res.send("Welcome!")
    } else {
        res.send("Wrong password or username")
    }
})

app.get('/secret', (req, res) => {
    res.send('This is a secret place! You cannot enter without credentials!')
})

app.listen(3000, () => {
    console.log('Listening on the port 3000')
})