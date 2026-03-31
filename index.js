const express = require("express");
const app = express();
const path = require("path");
const session = require('express-session');

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ SESSION PHẢI ĐẶT TRƯỚC
app.use(session({
    secret: '123',
    resave: false,
    saveUninitialized: true
}));

// static
app.use(express.static("public"));

// routes
const registerRoute = require("./routes/register");
const loginRoute = require("./routes/login");
const homeRoutes = require('./routes/home');

app.use("/register", registerRoute);
app.use("/login", loginRoute);
app.use("/", homeRoutes);

// ✅ admin route (1 lần thôi)
app.use('/admin', require('./routes/admin'));

// views
app.get('/home', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    res.sendFile(__dirname + '/views/home.html');
});
app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/admin.html'));
});

app.use('/employee', require('./routes/employee'));
app.get('/employee.html', (req, res) => {
    res.sendFile(__dirname + '/views/employee.html');
});

app.get('/attendance.html', (req, res) => {
    res.sendFile(__dirname + '/views/attendance.html');
});
const attendanceRoute = require("./routes/attendance");

app.use("/attendance", attendanceRoute);

app.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.send('ok');
    });
});
app.get('/user', (req, res) => {
    if (!req.session.user) return res.send(null);
    res.json(req.session.user);
});

// overtime html
app.get('/overtime.html', (req, res) => {
    res.sendFile(__dirname + '/views/overtime.html');
});

// overtime api
app.use("/api/overtime", require("./routes/overtime"));
// start server
app.listen(3000, () => {
    console.log("Server running http://localhost:3000/login");
});