const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

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

app.listen(PORT,()=>console.log("Server is running"));
