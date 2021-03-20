//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose =require('mongoose');
const encrypt = require('mongoose-encryption');
const ejs = require('ejs');

const app = express();

app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String, 
});

userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);

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

    const newUser = new User({

        email: req.body.username, 
        password: req.body.password
    });

    newUser.save((error)=>{
        if(error)
        {
            console.log(error);
        }
        else
        {
            res.render('secrets');
        }
    });
});

app.post('/login', (req, res)=>{

    const userName = req.body.username;
    const userPassword = req.body.password;

    User.findOne({email: userName}, (error, foundUser)=>{
        
        if(error)
        {
            console.log(error);
        }
        else{
            if(foundUser){

                if(foundUser.password === userPassword){
                    //console.log(foundUser.password);
                    res.render('secrets');
                }
            }
        }
    })
});