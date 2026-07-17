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
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
const crypto = require('crypto');
const upload = require('./config/configmulter');



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
            res.status(200).redirect("/profile");}
        else return res.status(400).send("something went wrong");
    });

});

//logout
app.get("/logout", (req,res)=>{
    res.cookie("token", ""); 
    res.redirect("/login");
});
//profile
app.get("/profile", isloggedIn, async (req,res)=>{
    let user = await userModel.findOne({email: req.user.email}).populate("posts");
    res.render("profile", { user });
});


//upload profile image
app.get("/upload", isloggedIn, (req,res)=>{
    res.render("profileupload");
});

app.post("/upload", isloggedIn, upload.single('image'), async (req,res)=>{
    let user = await userModel.findOne({email: req.user.email});
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
});





//post
app.post("/post", isloggedIn, async (req,res)=>{
    let user = await userModel.findOne({email: req.user.email});
    let {content} = req.body;
    let post = await postModel.create({user: user._id, content});
    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");

});


//likes in post
app.get("/like/:id", isloggedIn, async (req,res)=>{
    let post = await postModel.findOne({_id: req.params.id});
    if (post.likes.indexOf(req.user.userid) === -1) {
        post.likes.push(req.user.userid);
    }
    else {
        post.likes.splice(post.likes.indexOf(req.user.userid), 1);
    }
    await post.save();
    res.redirect("/profile");
});

//edit post
app.get("/edit/:id", isloggedIn, async (req,res)=>{
    let post = await postModel.findOne({_id: req.params.id});
    res.render("edit", { post });
});

app.post("/edit/:id", isloggedIn, async (req,res)=>{
    let post = await postModel.findOneAndUpdate({_id: req.params.id}, { content: req.body.content });
    res.redirect("/profile");
});




//middleware
function isloggedIn(req, res, next) {
    const token = req.cookies.token;
    if (!token) {res.redirect("/login");}
    else { 
        let data = jwt.verify(token, "secretkeyyy");
        req.user = data;
        next();
    }

}



app.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000");
});