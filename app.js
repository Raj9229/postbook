const express = require('express');
const userModel = require('./models/user');
const app = express();
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
const bcrypt = require('bcrypt');



app.get("/",(req,res)=>{
    res.render("index");
});

app.post("/register", async (req,res)=>{
    const { username, name, age, email, password } = req.body;

    let user = await userModel.findOne({email});
    if (user) return res.status(400).send("User already exists");

    
    res.render("index");
});






app.listen(3000,()=>{
    console.log("Server is running on http://localhost:3000");
});