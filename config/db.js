const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "12345",
  database: "test"
});

db.connect((err) => {
  if (err) {
    console.log("Database error");
  } else {
    console.log("Database connected");
  }
});

module.exports = db;