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
    return res.status(200).json(bk);
  } catch (err){
    return res.status(500).json({message: "Error: Server can't get book list."});
  }
});

const fetchBookDetail = (async (isbn) => {
  let detail = books[isbn];
  return detail;
});

const fetchBookDetailAuthor = (async (aut) => {
  let bdt = [];
  for (const k of Object.keys(books)){
    if (books[k].author == aut) {
      bdt.push(books[k]);
    }
  }
  return bdt;
});

const fetchBookTitle = (async (ti) => {
  for (const k of Object.keys(books)){
    if (books[k].title == ti) {
      return books[k];
    }
  }
  return null;
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try{
    const dt = await fetchBookDetail(req.params.isbn);
    if (dt){
      return res.status(200).json(dt);
    } else {
      return res.status(404).json({messsage: "Can't find book with that ISBN."});
    }
  } catch (err) {
    return res.status(500).json({message: "Error: Server can't get book detail."});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try{
    const dt = await fetchBookDetailAuthor(req.params.author);
    if (dt){
      return res.status(200).json(dt);
    } else {
      return res.status(404).json({messsage: "Can't find book with that Author."});
    }
  } catch (err) {
    return res.status(500).json({message: "Error: Server can't get book detail."});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try{
    const dt = await fetchBookTitle(req.params.title);
    if (dt){
      return res.status(200).json(dt);
    } else {
      return res.status(404).json({messsage: "Can't find book with that Title."});
    }
  } catch (err) {
    return res.status(500).json({message: "Error: Server can't get book detail."});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  if (Object.hasOwn(books, req.params.isbn)){
    return res.status(200).json(books[req.params.isbn].reviews);
  }
});

module.exports.general = public_users;
