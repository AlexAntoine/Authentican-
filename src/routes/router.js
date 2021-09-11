const mongoose = require('mongoose');
const express = require('express');
const User = require('../models/users');
const router = new express.Router();
//require these three packages
const session = require('express-session');
const passport = require('passport');

router.use(session({
    secret: 'Mmjwtbahyk88',
    resave: false,
    saveUninitialized: false
}));

router.use(passport.initialize());

router.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//GET ROUTES
router.get('/', (req, res) =>{
    res.render('home');
});

router.get('/login', (req, res) =>{
    res.render('login');
});


router.get('/register', (req, res) =>{
    res.render('register');
});

router.get('/submit', (req, res)=>{
    
    if(req.isAuthenticated())
        {
            res.render('submit');
        }
        else{
            res.redirect('/login');
        }
});

router.get('/secrets', (req, res)=>{

    User.find({'secrets': {$ne:null}}, (error, foundUsers)=>{
        
        if(error)
        {
            console.log(error);
        }
        else
        {
            res.render('secrets', {userWithSecrets: foundUsers})
        }
    })
});

router.get('/logout', (req, res)=>{

    req.logout();
    res.redirect('/');
});

//POST ROUTES

router.post('/login', (req, res)=>{

    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
 
    req.login(user, (error)=>{
 
         if(error)
         {
             console.log(error);
         }
         else
         passport.authenticate('local')(req, res, ()=>{
             res.redirect('/secrets');
         })
    })
 });

 router.post('/register', (req, res)=>{

    User.register({username: req.body.username}, req.body.password, (error, user)=>{

        if(error)
        {
            console.log(error);
            res.redirect('/register');
        }
        else
        {
            passport.authenticate('local')(req,res, ()=>{
                res.redirect('/secrets')
            })
        }
    })
    
});

router.post('/submit', (req, res)=>{

    const secret = req.body.secret;

    User.findById(req.user._id, (error, foundUser)=>{

        if(error)
        {
            console.log(error);
        }
        else{
            if(foundUser)
            {
                foundUser.secrets = secret;

                foundUser.save(()=>{
                    res.redirect('/secrets');
                })
            }
        }
    })
    console.log(req.user)
});
 

module.exports = router;