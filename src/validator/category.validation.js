const { body, param } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields.middleware');

const create_validation = [
    body('name')
        .exists().withMessage('Es obligatorio el campo nombre')
        .isString().trim().withMessage('Tiene que ser de tipo String'),
    body('description')
        .optional()
        .isString().trim().withMessage('Tiene que ser de tipo String'),
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
    body('name')
        .optional()
        .isString().trim().withMessage('Tiene que ser de tipo String'),
    body('description')
        .optional()
        .isString().trim().withMessage('Tiene que ser de tipo String'),
    validateFields,
];

module.exports = {
    create_validation,
    paramasId_validation,
    update_validation
};
