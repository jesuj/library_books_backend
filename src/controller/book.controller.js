const { validateFile } = require('../helpers/validate-file');
const Book = require('../models/Book');
const { matchedData } = require("express-validator");

const cloudinary = require('cloudinary').v2
cloudinary.config( process.env.CLOUDINARY_URL );


const book_post = async ( req , res ) => {

    try {
        const [ name_file, name_img ] = await Promise.all([
            validateFile( req.files.file, ['pdf'] ), 
            validateFile( req.files.img, ['png','jpg','jpeg','gif'] ) 
        ]);
        // console.log(name_file, name_img)
        const { tempFilePath : tempFilePathFile  } = req.files.file;
        const { tempFilePath : tempFilePathImg  } = req.files.img;

        // console.log(tempFilePathImg, tempFilePathFile)

        const [ file, img ] = await Promise.all([
            cloudinary.uploader.upload( tempFilePathFile, {
                public_id: name_file,
                folder: 'pdf'
            } ),
            cloudinary.uploader.upload( tempFilePathImg, {
                public_id: name_img,
                folder: 'img'
            } ),

        ]);

        console.log(file)
        console.log(img)

        const body = matchedData(req);

        const book = new Book({ ...body, file: file.secure_url, img: img.secure_url});
    
        await book.save();
    
        res.status(201).json(book);

    } catch (msg) {

        res.status(400).json({ msg });

    }

}


const books_get = async ( req, res ) => {
    
    const { id } = req.params;

    const book = await Book.findById(id).populate('categories', { _id: 1, name: 1, description:1 });
    if ( !book ) {
        return res.status(400).json({
            msg: `No existe un libros con el id ${ id }`
        });
    }

    res.json(book);
}

const books_get_all = async ( req, res ) => {

    const books = await Book.find().populate('categories', { _id: 1, name: 1});
    if ( !books ) {
        return res.status(400).json({
            msg: `No existe un libros con el id ${ id }`
        });
    }

    res.json(books);
}

const books_put = async (req, res) => {
    const { id } = req.params;

    const book = await Book.findById(id);
    if ( !book ) {
        return res.status(400).json({
            msg: `No existe un libros con el id ${ id }`
        });
    }

    // console.log(book)
    
    try {

        if ( book?.file && req?.files?.file &&  book?.img && req?.files?.img ) {
            console.log(req.files);

            // const valores = await Promise.all(
            // const [ name_new_file, name_new_img ] = await Promise.all(
                // validateFile( req.files.file, ['pdf']),
                // validateFile( req.files.img, ['png','jpg','jpeg','gif'] )
            // );

            const name_new_file = await validateFile( req.files.file, ['pdf']);
            const name_new_img = await validateFile( req.files.img, ['png','jpg','jpeg','gif'] );

            console.log(name_new_file)
            console.log(name_new_img)
            // console.log(valores)

            let name_url_array = book.file.split('/');
            let name_file    = name_url_array[ name_url_array.length - 1 ];
            const [ public_file_id  ] = name_file.split('.');
            
            const { tempFilePath : tempFilePathFile  } = req.files.file;
            
            name_url_array = book.img.split('/');
            name_file    = name_url_array[ name_url_array.length - 1 ];
            const [ public_img_id ] = name_file.split('.');

            const { tempFilePath: tempFilePathImg } = req.files.img;

            const [ destroyed_file , { secure_url: url_file }, destroyed_img, { secure_url: url_img }  ] = await Promise.all([
                cloudinary.uploader.destroy( `pdf/${public_file_id}` ),
                cloudinary.uploader.upload( tempFilePathFile, {
                    public_id: name_new_file,
                    folder: 'pdf'
                }),
                cloudinary.uploader.destroy( `img/${public_img_id}` ),
                cloudinary.uploader.upload( tempFilePathImg, {
                    public_id: name_new_img,
                    folder: 'img'
                }),
            ]);
            // console.log('destroyed_file', destroyed_file);
            // console.log('url_file', url_file);
            // console.log('destroyed_img', destroyed_img);
            // console.log('url_img', url_img);

            book.file = url_file;

            book.img = url_img;
        } else {

            if ( req?.files?.img || req?.files?.file ) {
                
                const file = req?.files?.img || req?.files?.file;
                const valid = req?.files?.img ? ['png','jpg','jpeg','gif'] : ['pdf'];
                const path_cloudinary = req?.files?.img ? 'img' : 'pdf';
                const url_book = req?.files?.img ? 'img' : 'file';

                // console.log('file', file);
                // console.log('valid', valid);
                // console.log('path', path_cloudinary);
    
                const name_new_file = await validateFile( file,valid);
                // console.log('name_new_img',name_new_file);
                const name_array = book[url_book].split('/');
                // console.log(book[url_book]);
                const name_file    = name_array[ name_array.length - 1 ];
                const [ public_id ] = name_file.split('.');
                // console.log('public_id',public_id);
    
                const { tempFilePath } = req.files[url_book];
                // const tempFilePath  = req.files[url_book];
                // console.log(tempFilePath)
    
                const [ _, {secure_url} ] = await Promise.all([
                    cloudinary.uploader.destroy( `${path_cloudinary}/${public_id}` ),
                    cloudinary.uploader.upload( tempFilePath, {
                        public_id: name_new_file,
                        folder: path_cloudinary
                    }),
                ]);
                // console.log(_, secure_url);
    
                book.img = secure_url;
            }

        }
        const body = matchedData(req);

        book.title = body.title || book.title;
        book.score = body.score || book.score;
        book.description = body.description || book.description;
        book.categories = body.categories || book.categories;

        await book.save();
    
        res.json(book);

    } catch (msg) {
        console.log(msg);
        res.status(400).json({ msg });

    }
}

const books_delete = async (req, res) => {
    const { id } = req.params;

    const book = await Book.findById(id);
    if ( !book ) {
        return res.status(400).json({
            msg: `No existe un libros con el id ${ id }`
        });
    }
    let name_url_array = book.file.split('/');
    const name_file    = name_url_array[ name_url_array.length - 1 ];
    const [ id_file ] = name_file.split('.');
    
    name_url_array = book.img.split('/');
    const name_img    = name_url_array[ name_url_array.length - 1 ];
    const [ id_img ] = name_img.split('.');
    try {
        
        const [ cloud1, cloud2, book_deleted ] = await Promise.all([
            cloudinary.uploader.destroy( `pdf/${id_file}` ),
            cloudinary.uploader.destroy( `img/${id_img}` ),
            book.remove()
        ]);
        console.log(cloud1, cloud2, book_deleted);
        res.status(200).json({msg: `Se elimino el libro con el titulo : ${book_deleted.title}` });
    } catch (error) {
        console.log(msg);
        res.status(400).json({ msg });
    }
}


module.exports = {
    book_post,
    books_get,
    books_put,
    books_get_all,
    books_delete,
}