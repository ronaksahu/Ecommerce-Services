const productRoutes = require('express').Router();
const Product = require('../model/product');
const Seller = require('../model/seller');


productRoutes.post('/addProduct', async (req, res) => {

    const { productName, price, discount, quantity, description } = req.body;

    const seller = req.user;

    try {
        const sellerExist = await Seller.exists({ _id: seller.id });

        if(!sellerExist) return res.status(200).json({ "status": "Seller ID Not exist"});
    
        const product = new Product({ productName, price, discount, quantity, description, sellerId: seller.id });
        const saveProduct = await product.save();
    
        if(!saveProduct) return res.status(200).json({ "status": "DB UPDATE FAILED!!" });

        res.status(200).json({ "status": "Product Added Successfully", saveProduct })


    } catch(err) {
        console.log("ERROR ", err);
        res.sendStatus(500);
    }
 
})

productRoutes.post('/updateProduct', async (req, res) => {

    const { productId, productName, price, discount, quantity, description } = req.body;
    const seller = req.user;

    try { 
        const sellerExist = await Seller.exists({ _id: seller.id });

        if(!sellerExist) return res.status(200).json({ "status": "Seller ID Not exist"});

        const productExist = await Product.exists({ _id: productId, sellerId: seller.id });

        if(!productExist) return res.status(200).json({ "status": "Product Not Exist" });

        Product.update({ _id: productId, sellerId: seller.id }, { productName, price, discount, quantity, description }, (err, doc) => {
            if(err) return res.status(200).json({ "status": "DB Update Failed" });

            res.status(200).json({"status": "Product Updated Successfully"});

        });



    } catch(err) {
        console.log("ERROR ", err);
        res.sendStatus(500);
    }
});

productRoutes.get('/product', async (req, res) => {

    try {

        const seller = req.user;
        const  productId  = req.query.productId;
        const sellerExist = await Seller.exists({ _id: seller.id });
        if(!sellerExist) return res.status(200).json({ "status": "Seller ID Not exist"});
        const productExist = await Product.findOne({ _id: productId, sellerId: seller.id }).select({ 'createdAt': 0, 'updatedAt': 0, 'sellerId': 0 });
        if(!productExist) return res.status(200).json({ "status": "Product Not Exist" });

        res.status(200).json({ "status": "product Found",
                product: productExist });

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
})

productRoutes.get('/allProduct', async (req, res) => {

    try {

        const seller = req.user;
        const { productId } = req.params;
        const sellerExist = await Seller.exists({ _id: seller.id });
        if(!sellerExist) return res.status(200).json({ "status": "Seller ID Not exist"});
        const productExist = await Product.find({ sellerId: seller.id }).select({ 'createdAt': 0, 'updatedAt': 0, 'sellerId': 0 });
        if(!productExist) return res.status(200).json({ "status": "Product Not Exist" });
        res.status(200).json({ "status": "product Found",
                product: productExist });

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = productRoutes;