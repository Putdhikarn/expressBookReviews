const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const bd = req.body;
  if (bd == null){
    return res.status(400).json({message: "Error: Missing request body."});
  }
  if(bd.username == null || bd.username == ""){
    return res.status(400).json({message: "Error: Missing Username."});
  }
  if(bd.password == null || bd.password == ""){
    return res.status(400).json({message: "Error: Missing Password."});
  }
  if (isValid(bd.username)){
    return res.status(400).json({message: "Error: Username already in use."});
  }
  users.push({
    username : bd.username,
    password : bd.password
  })
  return res.status(200).json({message: "Success, Registered user: " + bd.username});
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  const fetchBooks = new Promise((resolve, reject) => {
    // would always resolve since we using a simulated database.
    const bk = books;
    if (bk){
      resolve(bk);
    } else{
      reject({message: "Error: Server can't get book list."});
    }
  })
  fetchBooks
  .then((bk) => {
    return res.status(200).json(bk);
  }).catch((err) =>{
    return res.status(500).json(err);
  });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const fetchBooksDetail = new Promise((resolve, reject) => {
    const dt = books[req.params.isbn];
    if (dt){
      resolve(dt);
    } else{
      reject({message: "Error: Server can't get book detail."});
    }
  })
  fetchBooksDetail
  .then((bk) => {
    return res.status(200).json(bk);
  }).catch((err) =>{
    return res.status(500).json(err);
  });
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const fetchBooksAuthor = new Promise((resolve, reject) => {
    let bdt = [];
    for (const k of Object.keys(books)){
      if (books[k].author == req.params.author) {
        bdt.push(books[k]);
      }
    }
    if (bdt){
      resolve(bdt);
    } else{
      reject({message: "Error: Server can't get book detail."});
    }
  })
  fetchBooksAuthor
  .then((bk) => {
    return res.status(200).json(bk);
  }).catch((err) =>{
    return res.status(500).json(err);
  });
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const fetchBooksTitle = new Promise((resolve, reject) => {
    let bdt;
    for (const k of Object.keys(books)){
      if (books[k].title == req.params.title) {
        bdt = books[k];
      }
    }
    if (bdt){
      resolve(bdt);
    } else{
      reject({message: "Error: Server can't get book detail."});
    }
  });
  fetchBooksTitle
  .then((bk) => {
    return res.status(200).json(bk);
  }).catch((err) =>{
    return res.status(500).json(err);
  });
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const fetchBookReview = new Promise((resolve, reject) => {
    const rw = books[req.params.isbn].reviews;
    if (rw){
      resolve(rw);
    } else{
      reject({message: "Error: Server can't get book review."});
    }
  })
  fetchBookReview
  .then((bk) => {
    return res.status(200).json(bk);
  }).catch((err) =>{
    return res.status(500).json(err);
  });
});

module.exports.general = public_users;
