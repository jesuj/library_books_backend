const { body, param, check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields.middleware');

const create_validation = [
    body('title')
        .exists().withMessage('Es obligatorio el campo nombre')
        .isString().trim().withMessage('Tiene que ser de tipo String'),
    body('score')
        .exists().withMessage('Es obligatorio el campo score')
        .isInt().withMessage('Tiene que ser de tipo Entero'),
    body('description')
        .exists().withMessage('Es obligatorio el campo descripcion')
        .isString().trim().withMessage('Tiene que ser de tipo String'),
    body('categories')
        .exists().withMessage('Es obligatorio el campo categories')
        .isArray().withMessage('Tiene que ser de tipo Array'),
    validateFields,
];

const paramasId_validation = [
    param("id")
        .exists().withMessage('No tiene el identificador')
        .isMongoId().withMessage('No es un valor uuid el identificador'),
    validateFields,
]

const update_validation = [
    param("id")
        .exists().withMessage('No tiene el identificador')
        .isMongoId().withMessage('No es un valor uuid el identificador'),
    body('title')
        .optional()
        .isString().trim().withMessage('Tiene que ser de tipo String'),
    body('score')
        .optional()
        .isInt().withMessage('Tiene que ser de tipo Entero'),
    body('description')
        .optional()
        .isString().trim().withMessage('Tiene que ser de tipo String'),
    body('categories')
        .optional()
        .isArray().withMessage('Tiene que ser de tipo Array'),
    validateFields,
];

module.exports = {
    create_validation,
    paramasId_validation,
    update_validation
};
