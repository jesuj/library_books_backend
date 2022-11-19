const mongoose = require('mongoose');

const dbConnection = async () => {
    try {

        await mongoose.connect( process.env.MONGODB)

        console.log('Base de datos online');
        
    } catch (error) {
        console.log(error)
        throw new Error('Error en la instancia de la base de datos');
    }
}

module.exports = {
    dbConnection
};