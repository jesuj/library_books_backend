const { Router } = require('express');

const {
    create_validation,
    paramasId_validation,
    update_validation,
} = require('../validator/category.validation'); 
const { category_post,
        category_get,
        category_put,
        category_get_all,
        category_delete,
        category_get_books,
        category_id_get_books,
} = require('../controller/category.controller');

const router = Router();

router.post( '/', create_validation, category_post );

router.put('/:id', update_validation, category_put);

router.get('/', category_get_all);
router.get( '/books', category_get_books );
router.get( '/:id', paramasId_validation, category_get );
router.get( '/books/:id', paramasId_validation, category_id_get_books );

router.delete('/:id', paramasId_validation, category_delete);

module.exports = router;