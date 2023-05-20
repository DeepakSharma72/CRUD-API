const mongoose = require('mongoose');

const dbURL = process.env.DB_URL;
  
const connectDB = async () => {
    console.log(dbURL);
    try{
        const DB = await mongoose.connect(dbURL);
        console.log('succesfully connected to the database\n');
    }
    catch(err){
        console.log("Unable to connect to the database due to the error: ",err,"\n");
    }
}

module.exports = connectDB;