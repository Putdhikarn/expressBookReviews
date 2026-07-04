const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
  let valid = false ;
  users.forEach((u) => {
      valid = (username == u.username);
      if (valid)
        return;
  });
  return valid;
}

const authenticatedUser = (username,password)=>{
  let authed = false;
  users.forEach((u) => {
      if (username == u.username)
        if (password == u.password){
          authed = true;
          return;
        }
  });
  return authed;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const bd = req.body;
  if (bd == null){
    return res.status(400).json({message: "Error: Missing request body."});
  }
  if(bd.username == null || bd.username == ""){
    return res.status(400).json({message: "Error: Missing Login Username."});
  }
  if(bd.password == null || bd.password == ""){
    return res.status(400).json({message: "Error: Missing Login Password."});
  }
  if (authenticatedUser(bd.username, bd.password)){
    const payload = {
      username:bd.username,
    }
    const tk = jwt.sign(payload, "SEEECREEEET", {expiresIn:"1h"});
    return res.status(200).json({
      message: "Login Success.",
      token:tk,
    });
  } else {
    return res.status(401).json({message: "Error: Unable to login, Invalid Credential."});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bd = req.body;
  if (bd == null){
    return res.status(400).json({message: "Error: Missing request body."});
  }
  if (bd.review == null || bd.review == ""){
    return res.status(400).json({message: "Error: Missing review messages."});
  }
  if (isValid(req.username)){
    books[req.params.isbn].reviews[req.username] = bd.review;
    return res.status(200).json({message: "Added review from user: "+req.username + " review: " + bd.review});
  } else {
    return res.status(403).json({message: "Error: Invalid or Expired Token."});
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  if (isValid(req.username)){
    if (books[req.params.isbn].reviews[req.username]){
      delete books[req.params.isbn].reviews[req.username];
      return res.status(200).json({message: "Deleted review for user: "+req.username});
    } else {
      return res.status(400).json({message: "Error: No review to delete."});
    }
  } else {
    return res.status(403).json({message: "Error: Invalid or Expired Token."});
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
