const routes = require('express').Router();
const Product = require('../model/product');


routes.get('/products', async (req, res) => {

    const productPerPage = 6;
    const pageCount = req.query.page || 1;
    try {

        const productList = await Product.find()
                .skip((productPerPage * pageCount) - productPerPage ).populate('sellerId', [ 'username', 'email', 'sellerShopName' ])
                .limit(productPerPage).select({ 'createdAt':0, 'updatedAt':0 });

        res.status(200).json({ "status": "success", 'productListSize': productList.length, productList });

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }

})

module.exports = routes;