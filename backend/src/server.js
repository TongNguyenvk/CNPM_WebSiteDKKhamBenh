const app = require('./app')
require('dotenv').config();

const port = process.env.PORT || 8888;
const sequelize = require('./config/database');





app.listen(port,() =>{
    console.log("test tren port", port);
})