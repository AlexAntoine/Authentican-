//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const ejs = require('ejs');
//require these three packages
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

/*
The order of the code is important 
*/

//sessions set up
app.use(session({
    secret: 'Mmjwtbahyk88',
    resave: false,
    saveUninitialized: false
}));

//initialize passport
app.use(passport.initialize());
//use passport to manage sessions
app.use(passport.session());



mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
mongoose.set('useCreateIndex', true);

const userSchema = new mongoose.Schema({
    email: String,
    password: String, 
});

//set up userSchema to use passport local mongoose
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", userSchema);

//create a local login stategy
passport.use(User.createStrategy());

//set up passport serializer and deserilaieze to set up user 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const alex = new User({
    email: 'antoinealex1234@gmail.com',
    password: 'doras9070'
});


app.get('/', (req, res) =>{
    res.render('home');
});


app.get('/login', (req, res) =>{
    res.render('login');
});


app.get('/register', (req, res) =>{
    res.render('register');
});

app.post('/register', (req, res)=>{

    
});

app.post('/login', (req, res)=>{

   
});

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});