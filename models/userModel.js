const db = require("../config/db");

exports.checkUser = (username,callback)=>{
    
    const sql = "SELECT * FROM users WHERE username=?";

    db.query(sql,[username],(err,result)=>{
        if(err) throw err;
        callback(result);
    });

};

exports.createUser = (username,password,callback)=>{

    const sql = "INSERT INTO users(username,password) VALUES (?,?)";

    db.query(sql,[username,password],(err)=>{
        if(err) throw err;
        callback();
    });

};

