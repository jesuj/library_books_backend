const { Router } = require('express');
const {
        create_validation,
        paramasId_validation,
        update_validation,
} = require('../validator/book.validation'); 
const { book_post, 
        books_get, 
        books_put, 
        books_get_all,
        books_delete,
} = require('../controller/book.controller');

const router = Router();

router.post( '/', create_validation, book_post );

router.put('/:id', update_validation, books_put);

router.get('/', books_get_all);
router.get( '/:id', paramasId_validation, books_get );

router.delete('/:id', paramasId_validation, books_delete);

module.exports = router;