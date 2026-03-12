const express = require("express");
const app = express();

const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static("public"));

app.use("/register",registerRoute);

app.use("/login",loginRoute);

const path = require("path");

app.get("/home",(req,res)=>{
    res.sendFile(path.join(__dirname,"views/home.html"));
});
app.listen(3000,()=>{

    console.log("Server running http://localhost:3000/register");

});