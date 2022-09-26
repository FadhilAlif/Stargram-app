const express = require("express"); 
const PORT = 3000; 
const app = express();  
const router = require('./routes/routes');
 
app.use(express.json()); 
app.use(router);
 
app.get('/', (req, res)=> {
    res.send("Hello world");
})

app.listen(PORT, (req,res)=>{ 
    console.log(`Server Berjalan pada PORT : `,PORT);
})
