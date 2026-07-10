const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
let books = require("./router/booksdb.js");

const app = express();
const PORT = 5000;

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    const hd = req.headers["authorization"];
    if (hd == null){
        return res.status(401).json({message: "Error: Missing Token."});
    }
    const tk = hd.split(" ")[1];
    if (tk == null){
        return res.status(401).json({message: "Error: Missing Token."});
    }
    jwt.verify(tk, "SEEECREEEET", (err, decoded) => {
        if (err) {
            return res.status(403).json({message: "Error: Invalid or Expired Token."});
        } else {
            req.username = decoded.username;
            next();
        }
    })
});

app.use("/customer", customer_routes);
app.use("/", genl_routes);

// To Make Mark happy...
// Mark REALLY want axios...
app.get("/dbacc/books", async (req, res) => {
    const bk = books;
    return res.status(200).json(bk);
});

// To Make Mark happy...
// Mark REALLY want axios...
app.get("/dbacc/book/isbn/:isbn", async (req, res) => {
    const dt = books[req.params.isbn];
    return res.status(200).json(dt);
});

// To Make Mark happy...
// Mark REALLY want axios...
app.get("/dbacc/book/author/:author", async (req, res) => {
    let bdt = [];
    for (const k of Object.keys(books)){
      if (books[k].author == req.params.author) {
        bdt.push(books[k]);
      }
    }
    return res.status(200).json(bdt);
});

// To Make Mark happy...
// Mark REALLY want axios...
app.get("/dbacc/book/title/:title", async (req, res) => {
    let bdt;
    for (const k of Object.keys(books)){
      if (books[k].title == req.params.title) {
        bdt = books[k];
      }
    }
    return res.status(200).json(bdt);
});

// To Make Mark happy...
// Mark REALLY want axios...
app.get("/dbacc/book/review/:isbn", async (req, res) => {
    const bk = books[req.params.isbn];
    if (bk != null){
        return res.status(200).json(bk.reviews);
    }
    return res.status(500).json({message: "Error: Can't get a review for a book with that ISBN number."});
});

app.listen(PORT,()=>console.log("Server is running"));
