const express = require('express');
require('dotenv').config();
const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded form data
app.use(express.urlencoded({ extended: false }));

const DB = require('./Database/connection');
DB();

app.use(require('./Routers/user'));

app.listen(process.env.PORT,()=>{
    console.log("Listing to the port no: ",process.env.PORT);
})
 