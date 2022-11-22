const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(express.json());

// Koneksi ke Database MySQL
const db = mysql.createConnection({
    user: "fariz",
    host: "localhost",
    password: "fariz",
    database: "log-regDB"
});
// Koneksi ke Database MySQL

// Implementasi Cors
app.use(
    cors({
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    })
);
// Implementasi Cors

// Implementasi Body-Parser
app.use(bodyParser.urlencoded({ extended: true }));
// Implementasi Body-Parser

// Proses Register
app.post("/register", (req, res) => {
    // Variabel Data Yang Dikirim Dari Client (FrontEnd)
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;

    // console.log(username, password, name);

    bcrypt.hash(password, 10, (err, hash) => {
        // if (err) {
        //     console.log(hash);
        // }
        db.query("INSERT INTO users (name, username, password) VALUES (?,?,?)",
            [name, username, hash]);
    });
});
// Proses Register

app.post("/", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    db.query(
        "SELECT * FROM users WHERE username  = ?;",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err });
            }

            console.log(result);

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        let token = jwt.sign(
                            { userId: result[0].id, username: result[0].username },
                            "secretkeyappearshere",
                            { expiresIn: "1h" }
                        );
                        res.send(token);
                    }
            
                    else {
                        res.send({ message: "username and password are wrong!" });
                    }
                });
            }

            else {
                res.send({ message: "user not found!" });
            }
        }
    );
});

app.listen('3001', () => {
    console.log("running server")
});