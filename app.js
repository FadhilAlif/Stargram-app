if (process.env.NODE_ENV !== 'production') require('dotenv').config();
const express = require("express"); 
const PORT = process.env.PORT || 1555; 
const app = express();  
const router = require('./routes/routes');
const cors = require('cors');

app.use(cors());
 
app.use(express.json()); 
app.use(router);
 

app.listen(PORT, (req,res)=>{ 
    console.log(`Server run in PORT :`,PORT);
}) 
  

module.exports = app;
