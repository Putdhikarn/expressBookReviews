const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  let bk = books
  return res.status(200).json(bk);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  if (books.hasOwn(req.params.isbn)){
    return res.status(200).json(books[req.params.isbn]);
  }
  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let aut = req.params.author;
  for (const k of Object.keys(books)){
    if (books[k].author == aut){
      return res.status(200).json(books[k]);
    }
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let ti = req.params.title;
  for (const k of Object.keys(books)){
    if (books[k].title == ti){
      return res.status(200).json(books[k]);
    }
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
