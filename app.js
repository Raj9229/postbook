const express = require('express');
const userModel = require('./models/user');
const postModel = require('./models/post');
const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require("cookie-parser");
app.use(cookieParser());



app.get("/",(req,res)=>{
    res.render("index");
});


//register
app.post("/register", async (req,res)=>{
//taking user input from the request body
    const { username, name, age, email, password } = req.body; 

//check if the user already exists in the database
    let user = await userModel.findOne({email});
    if (user) return res.status(400).send("User already exists");
//register the user by hashing the password and saving the user to the database
const salt = await bcrypt.genSalt(10);
const hash = await bcrypt.hash(password, salt);
const newUser = await userModel.create({
    username,
    name,
    age,
    email,
    password: hash
});
//creating a JWT token for the user and sending it as a cookie in the response
    const token = jwt.sign({ email: newUser.email, userid: newUser._id },"secretkeyyy");
    res.cookie("token", token);    
    res.send("registered successfully");
});

//login
app.get("/login", (req,res)=>{
    res.render("login");
});

app.post("/login", async (req,res)=>{
    const { email, password } = req.body;
//check if the user exists in the database
    let user = await userModel.findOne({email});
    if (!user) return res.status(400).send("something went wrong");
//compare the password provided by the user with the hashed password stored in the database
    bcrypt.compare(password, user.password ,(err, result)=>{
        if (result) {
            const token = jwt.sign({ email: user.email, userid: user._id }, "secretkeyyy");
            res.cookie("token", token);
            res.status(200).send("login successfully");}
        else return res.status(400).send("something went wrong");
    });

});

//logout
app.get("/logout", (req,res)=>{
    res.cookie("token", ""); 
    res.redirect("/login");
});
//profile
app.get("/profile", isloggedIn, (req,res)=>{
    console.log(req.user);
    res.send("profile page");
})

function isloggedIn(req, res, next) {
    const token = req.cookies.token;
    if (token == "") {res.redirect("/login");}
    else { 
        let data = jwt.verify(token, "secretkeyyy");
        req.user = data;
        next();
    }

}



app.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000");
});