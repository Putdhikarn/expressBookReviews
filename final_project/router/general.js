const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

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
  try{
    // to simulate a external database access
    const bk = await axios.get("http://localhost:5000/dbacc/books");
    if (bk.data){
      return res.status(200).json(bk.data);
    } else {
      return res.status(404).json({message: "Error: No books to fetch."});
    }
  } catch (err){
    console.log(err);
    return res.status(200).json({message: "Error: Server can't fetch book list."});
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  try{
    // to simulate a external database access
    const bk = await axios.get("http://localhost:5000/dbacc/book/isbn/" + req.params.isbn);
    if (bk.data){
      return res.status(200).json(bk.data);
    } else {
      return res.status(404).json({message: "Error: Can't fetch book with that ISBN."});
    }
  } catch (err){
    console.log(err);
    return res.status(200).json({message: "Error: Server can't fetch book detail."});
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  try{
    // to simulate a external database access
    const bk = await axios.get("http://localhost:5000/dbacc/book/author/" + req.params.author);
    if (bk.data){
      return res.status(200).json(bk.data);
    } else {
      return res.status(404).json({message: "Error: Can't fetch book with that Author."});
    }
  } catch (err){
    console.log(err);
    return res.status(200).json({message: "Error: Server can't fetch book detail."});
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  try{
    // to simulate a external database access
    const bk = await axios.get("http://localhost:5000/dbacc/book/title/" + req.params.title);
    if (bk.data){
      return res.status(200).json(bk.data);
    } else {
      return res.status(404).json({message: "Error: Can't fetch book with that Title."});
    }
  } catch (err){
    console.log(err);
    return res.status(200).json({message: "Error: Server can't fetch book detail."});
  }
});

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
  try{
    // to simulate a external database access
    const bk = await axios.get("http://localhost:5000/dbacc/book/review/" + req.params.isbn);
    if (bk.data){
      return res.status(200).json(bk.data);
    } else {
      return res.status(404).json({message: "Error: Can't fetch reviews for that books."});
    }
  } catch (err){
    console.log(err);
    return res.status(200).json({message: "Error: Server can't fetch book reviews."});
  }
});

module.exports.general = public_users;
