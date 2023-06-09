//jshint esversion:6
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const md5 = require('md5');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();

const secret = process.env.SECRET

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
});

const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/register", function(req, res){
    bcrypt.hash(req.body.password, saltRounds, function(err, hash){
        const newUser = new User({
            email: req.body.username,
            password: hash,
        });
        newUser.save().then(function(result){
            res.render("secrets");
        });
    });
});

app.post("/login", function(req, res){
    const userName = req.body.username;
    const password = req.body.password;
    User.findOne({email: userName}).then(function(result){
        if(result){
            bcrypt.compare(password, result.password, function(err, result) {
                if(result){
                    res.render("secrets");
                }else{
                    res.render("login");
                }
            });
        }else{
            res.send("Invalid username or password");
        }
    });
});


app.listen(3000, function(){
    console.log('Server started on port 3000');
})
