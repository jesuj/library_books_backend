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

        const body = matchedData(req);

        const book = new Book({ 
            ...body, file: 
            file.secure_url, 
            id_file: file.public_id, 
            img: img.secure_url, 
            id_img: img.public_id
        });
    
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
    
    try {

        if ( book?.file && req?.files?.file &&  book?.img && req?.files?.img ) {

            const name_new_file = await validateFile( req.files.file, ['pdf']);
            const name_new_img = await validateFile( req.files.img, ['png','jpg','jpeg','gif'] );

            console.log(name_new_file)
            console.log(name_new_img)
            
            const { tempFilePath : tempFilePathFile  } = req.files.file;
            const { tempFilePath: tempFilePathImg } = req.files.img;

            const [ 
                destroyed_file, 
                { secure_url: url_file, public_id: id_file }, 
                destroyed_img, 
                { secure_url: url_img, public_id: id_img }
            ] = await Promise.all([
                cloudinary.uploader.destroy( book.id_file ),
                cloudinary.uploader.upload( tempFilePathFile, {
                    public_id: name_new_file,
                    folder: 'pdf'
                }),
                cloudinary.uploader.destroy( book.id_img ),
                cloudinary.uploader.upload( tempFilePathImg, {
                    public_id: name_new_img,
                    folder: 'img'
                }),
            ]);
            // console.log('destroyed_file', destroyed_file);
            // console.log('id_file', id_file);
            // console.log('url_file', url_file);
            // console.log('destroyed_img', destroyed_img);
            // console.log('id_img', id_img);
            // console.log('url_img', url_img);

            book.file = url_file;
            book.id_file = id_file;

            book.img = url_img;
            book.id_img = url_img;
        } else {

            if ( req?.files?.img || req?.files?.file ) {
                
                const file = req?.files?.img || req?.files?.file;
                const valid = req?.files?.img ? ['png','jpg','jpeg','gif'] : ['pdf'];
                const path_cloudinary = req?.files?.img ? 'img' : 'pdf';
                const url_book = req?.files?.img ? 'img' : 'file';
    
                const name_new_file = await validateFile( file,valid);
    
                const { tempFilePath } = req.files[url_book];
    
                const [ _, {secure_url, public_id} ] = await Promise.all([
                    cloudinary.uploader.destroy( book[`id_${url_book}`] ),
                    cloudinary.uploader.upload( tempFilePath, {
                        public_id: name_new_file,
                        folder: path_cloudinary
                    }),
                ]);
                console.log(_, secure_url);
    
                book[url_book] = secure_url;
                book[`id_${url_book}`] = public_id;
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
    try {  
        const [ cloud1, cloud2, book_deleted ] = await Promise.all([
            cloudinary.uploader.destroy( book.id_file ),
            cloudinary.uploader.destroy( book.id_img ),
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