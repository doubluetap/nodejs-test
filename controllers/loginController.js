const userModel = require("../models/userModel");

exports.login = (req,res)=>{

const {username,password} = req.body;

userModel.checkUser(username,(result)=>{

console.log(result);

if(result.length === 0){
return res.json({
success:false,
message:"Tài khoản không tồn tại"
});
}

const user = result[0];

if(user.password !== password){
return res.json({
success:false,
message:"Sai mật khẩu"
});
}

        req.session.user = user;


res.json({
success:true,
message:"Đăng nhập thành công"
});

});

};
