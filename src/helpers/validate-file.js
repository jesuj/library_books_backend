const { v4: uuidv4 } = require('uuid');

const validateFile = ( file, extensionesValidas = ['pdf','png','jpg','jpeg','gif'] ) => {

    return new Promise( (resolve, reject) => {

        // const { file } = files;
        // console.log(file)
        // const nombreCortado = file.name.split('.');
        const nombreCortado = file.name.split('.');
        const extension = nombreCortado[ nombreCortado.length - 1 ];
        // console.log(file,extension);

        // Validar la extension
        if ( !extensionesValidas.includes( extension ) ) {
            return reject(`La extensión "${ extension }" no es permitida - ${ extensionesValidas }`);
        }

        const new_name = uuidv4();
        // console.log(new_name);
        
        resolve( new_name );

    });

}

module.exports = {
    validateFile
}