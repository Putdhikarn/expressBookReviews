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
  return res.status(200).json({message: "Registered user: " + bd.username});
});

const fetchbook = (async () => {
      return books;
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bk = await fetchbook();
    console.log(bk);
    return res.status(200).json(bk);
  } catch (err){
    return res.status(500).json({message: "Error: Server can't get book list."});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  if (Object.hasOwn(books, req.params.isbn)){
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
  if (Object.hasOwn(books, req.params.isbn)){
    return res.status(200).json(books[req.params.isbn].reviews);
  }
});

module.exports.general = public_users;
