const path = require("path");
const userModel = require("../models/userModel");


exports.register = (req,res)=>{

    const {username,password,confirm} = req.body;

    if(password !== confirm){
        return res.json({message:"Password không khớp"});
    }

    userModel.checkUser(username,(result)=>{

        if(result.length > 0){
            return res.json({message:"Tài khoản đã tồn tại"});
        }

        userModel.createUser(username,password,()=>{

            res.json({message:"Đăng ký thành công"});

        });

    });

};