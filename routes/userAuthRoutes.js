const routes = require('express').Router();
const Product = require('../model/product');
const User = require('../model/user');


routes.post('/addToCart', async (req, res) => {

    const { productId, quantity } = req.body;
    const user = req.user;
    try {
        const product = await Product.findOne({ _id: productId }).select({ 'quantity': 1 });
        if(!product) return res.status(200).json({ "status": "Product not found in DB!!"});

        if(Number(quantity) > product.quantity) return res.status(200).json({ "status": `Maximum ${product.quantity} can be added in Cart` });

        const userData = await User.findOne({ _id: user.id }).select({  'myCart': 1});
        let index = -1;
        if(userData.myCart) {
            index = userData.myCart.findIndex(item => item.productId == productId);
        }
        if(index != -1) {
            if(product.quantity < (userData.myCart[index].quantity + Number(quantity)))  return res.status(200).json({ "status": `Maximum ${product.quantity} can be added in Cart` });
            userData.myCart[index].quantity += Number(quantity);
        } else {
            const myCart = { productId, quantity: Number(quantity) };
            userData["myCart"].push(myCart);
        }
        const updatedCart = await userData.save();

        if(!updatedCart) return res.status(200).json({ "status": "Cart not updated" })

        res.status(200).json({ "status": "Product Added in Cart" })

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});

routes.post('/removeFromCart', async (req, res) => {

    const productId = req.body.productId;
    const user = req.user;

    try {

        const deleteItemFromCart = await User.update(
            { _id: user.id },
            { $pull: { myCart: { productId } } },
            { multi: true }
            );

            console.log(deleteItemFromCart);

            res.status(200).json({ "staus": "Item Deleted from Cart" });

    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

module.exports = routes;