const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');
const fileUpload = require('express-fileupload');

class Server{

    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000; 
                
        this.connectDB();
        
        this.middleware();

        this.path = {
            book: '/api/books',
            category: '/api/category',
        }; 
        
        this.routes();

    }

    async connectDB(){
        await dbConnection();
    }

    middleware(){
        this.app.use( cors() )
        this.app.use( express.json() );
        this.app.use(fileUpload({
            useTempFiles : true,
            tempFileDir : '/tmp/'
        }));
    }

    routes(){
        
        this.app.use( this.path.book, require('../routes/book.routes') )
        this.app.use( this.path.category, require('../routes/category.routes') )
        
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log(`Server started ${this.port}`);
        })
    }
}

module.exports = Server;