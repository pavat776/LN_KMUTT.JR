const express = require('express');
const app = express();
const fs = require('fs');
const hostname = 'localhost';
const port = 3001;
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
const mysql = require('mysql');

const { table } = require('console');
const { userInfo } = require('os');
const { errorMonitor } = require('events');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/img/');
    },

    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
  });

  const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "ln_kmutt"
})

con.connect(err => {
    if(err) throw(err);
    else{
        console.log("MySQL connected");
    }
})

const queryDB = (sql) => {
    return new Promise((resolve,reject) => {
        // query method
        con.query(sql, (err,result, fields) => {
            if (err) reject(err);
            else
                resolve(result)
        })
    })
}

app.post('/regisDB', async (req,res) => {
    let now_date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    let sql = "CREATE TABLE IF NOT EXISTS userInfo (id INT AUTO_INCREMENT PRIMARY KEY, reg_date TIMESTAMP, username VARCHAR(255), email VARCHAR(100),password VARCHAR(100),img VARCHAR(100))";
    let result = await queryDB(sql);
    sql = `INSERT INTO userInfo (reg_date,username, email, password,img) VALUES ("${now_date}","${req.body.username}","${req.body.email}","${req.body.password}","avartar.png")`;
    result = await queryDB(sql);
    console.log("New ID ADD now");
    console.log(result);
    return res.redirect('index.html');

})

app.get('/setscore', async (req,res) => {
    let sql = `update userInfo set score = \"${req.query.score}\" where username = \"${req.query.username}\"`;
    let result = await queryDB(sql);
    return res.send();
})

app.get('/getscore', async (req,res) => {
    let sql = `select score from userInfo where username = \"${req.query.username}\"`;
    let result = await queryDB(sql);
    return res.send(result);
})

app.get('/setcourse', async (req,res) => {
    let sql = `update userInfo set course = \"${req.query.course}\" where username = \"${req.query.username}\"`;
    let result = await queryDB(sql);
    return res.send();
})



const updateImg = async (username, filen) => {
    let sql = `UPDATE userInfo SET img = '${filen}' WHERE username = '${username}'`;
    let result = await queryDB(sql)
    console.log(result)
}

app.get('/logout', (req,res) => {
    res.clearCookie('username');
    res.clearCookie('img');
    return res.redirect('login.html');
})

app.listen(port, hostname, () => {
    console.log(`Server running at   http://${hostname}:${port}/index.html`);
});

app.post("/checkLogin", async (req, res) => {
    let sql = `SELECT username, img, password FROM userInfo`;
    let result = await queryDB(sql);
    result = Object.assign({},result);
     var keys = Object.keys(result);
    var IsCorrect = false;
    for (var numberOfKeys = 0; numberOfKeys < keys.length; numberOfKeys++) {
    if (
      req.body.username == result[keys[numberOfKeys]].username &&
      req.body.password == result[keys[numberOfKeys]].password
    ) {
      console.log("login successful");
      res.cookie("username", result[keys[numberOfKeys]].username);
      res.cookie("img", result[keys[numberOfKeys]].img);
      IsCorrect = true;
      return res.redirect("/learning-web/home.html");
    }
  }
  if (IsCorrect == false) {
    IsCorrect = false;
    console.log("login failed");
    return res.redirect("login.html?error=1");
  }
});

