const Category = require('../models/Category');
const { matchedData } = require("express-validator");
const mongoose = require("mongoose");

const category_post = async ( req , res ) => {
    
    const body = matchedData(req);

    const category = new Category(body);
    await category.save();

    res.json(category);

}


const category_get = async (req = request, res = response) => {
    
    const { id } = req.params;

    const category = await Category.findById(id);
    if ( !category ) {
        return res.status(400).json({
            msg: `No existe la categoria con el id ${ id }`
        });
    }

    res.json(category);
}

const category_get_all = async (req = request, res = response) => {

    const categories = await Category.find();
    if ( !categories ) {
        return res.status(400).json({
            msg: `No existe una categoria con el id ${ id }`
        });
    }

    res.json(categories);
}


const category_put = async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if ( !category ) {
        return res.status(400).json({
            msg: `No existe un libros con el id ${ id }`
        });
    }

    const body = matchedData(req);

    category.name = body.name || category.name;
    category.description = body.description || category.description;

    await category.save();

    res.json(category);
}

const category_delete = async (req, res) => {
    const { id } = req.params;

    const category = await Category.findById(id);
    if ( !category ) {
        return res.status(400).json({
            msg: `No existe una Categoria con el id ${ id }`
        });
    }
    
    const category_deleted = await category.remove()

    res.status(200).json(
        {msg: `Se elimino el libro con el titulo : ${category_deleted.name}` }
    );
}

const category_get_books = async (req = request, res = response) => {

    const categories = await Category.aggregate([
        {
            $lookup: {
                from: "books",
                let: { 
                    aliasIdCategory : "$_id", 
                 },
                pipeline: [{
                    $match: {
                        $expr : {
                            $in : ["$$aliasIdCategory", "$categories"]
                        }
                    }
                }],
                as: 'categoryByBooks',
            }
        }
    ]);
    console.log(categories)
    res.json(categories);
}

const category_id_get_books = async (req, res) => {

    const { id } = req.params;
    const category = await Category.findById(id);
    if ( !category ) {
        return res.status(400).json({
            msg: `No existe una Categoria con el id ${ id }`
        });
    }

    const category_by_books = await Category.aggregate([
        {
            $match: {
                _id : {
                    $eq : new mongoose.Types.ObjectId(id)
                }
            },
        },
        {
            $lookup: {
                from: "books",
                let: { 
                    aliasIdCategory : "$_id", 
                 },
                pipeline: [{
                    $match: {
                        $expr : {
                            $in : ["$$aliasIdCategory", "$categories"]
                        }
                    }
                }],
                as: 'BookByCategory',
            }
        },
        {
            $project: {
                __v: 0,
                BookByCategory : {
                    categories: 0,
                    __v: 0,
                    file: 0,
                }
            }
        }
    ]);

    res.json(category_by_books);
}

module.exports = {
    category_post,
    category_get,
    category_put,
    category_get_all,
    category_delete,
    category_get_books,
    category_id_get_books,
}