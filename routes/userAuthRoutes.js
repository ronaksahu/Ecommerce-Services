const routes = require('express').Router();
const Product = require('../model/product');
const User = require('../model/user');
const { Cart } = require('../model/shoppingCart');

routes.post('/getCartItems', async (req, res) => {

    const user = req.user;

    try {

        const cartItems = await User.findOne({ _id: user.id })
            .populate(['myCart.productId',  'myCart.productId.sellerId'] /*, ['productName', 'price', 'discount', 'imageUrl', 'sellerId']*/)
           // .populate('myCart.productId.sellerId', [ 'username', 'email', 'sellerShopName' ])
            .select({ 'myCart': 1, '_id': 0});
        console.log(cartItems);
        res.status(200).send(cartItems);

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});


routes.get('/getCartItems', async (req, res) => {

    const user = req.user;

    try {

        const cart = await Cart.findOne({ userId: user.id }).populate({
            path: "items.productId",
            select: "productName price sellerId",
            populate: {
                path: "sellerId",
                select: "username sellerShopName"
            }
        }).select({ "userId": 0 });

        res.status(200).json({
            cart
        });

    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
 


})


routes.post('/addItemInCart', async (req, res) => {

    const  productId = req.body.productId;
    const  quantity = Number(req.body.quantity);

    const user = req.user;
    try {
       
       const productDetails = await Product.findById(productId);

       // Product Id doesn't exist in Product Collection
       if(!productDetails) return res.status(200).json({
           status: "Not Found"
       });

        // Fetch user Cart
       const cartDetails = await Cart.findOne({ userId: user.id });

       if(cartDetails) {
            // check if Product Id already exist 
            const indexFound = cartDetails.items.findIndex(item => item.productId == productId );

            // Remove item from the cart if quantity is set to zero
            if( indexFound !== -1 && quantity == 0) {
                cartDetails.items.splice(indexFound, 1);
                if(cartDetails.items.length == 0) {
                    cartDetails.subTotal = 0;
                } else {
                    cartDetails.subTotal = cartDetails.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
            }
            else if(indexFound !== -1) {
                cartDetails.items[indexFound].quantity = cartDetails.items[indexFound].quantity + quantity;
                cartDetails.items[indexFound].total = cartDetails.items[indexFound].quantity * productDetails.price;
                cartDetails.items[indexFound].price = productDetails.price;
                cartDetails.subTotal = cartDetails.items.map(item => item.total).reduce((acc, next) => acc + next);
            } else if (quantity > 0) {
                cartDetails.items.push({
                    productId,
                    quantity,
                    price: productDetails.price,
                    total: parseInt(productDetails.price * quantity)
                });
                cartDetails.subTotal = cartDetails.items.map(item => item.total).reduce((acc, next) => acc + next);

            } else {
                return res.status(400).json({
                    "status": "Invalid Request"
                })
            }

            const data = await cartDetails.save();
            res.status(200).json({
                "status" : "Process Successfull",
                data: data
            })
       } else {
           const cartData = {
               items: [{
                   productId: productId,
                   quantity: quantity,
                   price: productDetails.price,
                   total: parseInt(productDetails.price * quantity)
               }],
               subTotal: parseInt(productDetails.price * quantity),
               userId: user.id
           }

           const cartAdd = await Cart.create(cartData);
           res.status(200).json({
               "status": "Process Completed",
               cartAdd
           })
       }
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
});



routes.post('/removeFromCart', async (req, res) => {

    const productId = req.body.productId;
    const user = req.user;

    try {

        const cart = await Cart.findOne({ userId: user.id });

        if(!cart) return res.status(200).json({ "status": "Process Complete" });

        const indexFound = cart.items.findIndex(item => item.productId == productId );

        if(indexFound !== -1) {
            cart.items.splice(indexFound, 1);
                if(cart.items.length == 0) {
                    cart.subTotal = 0;
                } else {
                    cart.subTotal = cart.items.map(item => item.total).reduce((acc, next) => acc + next);
                }
        }

        const cartSave = await cart.save();

        res.status(200).json({ "status": "Process Complete",
            cartSave });

       
    } catch(error) {
        console.log(error);
        res.sendStatus(500);
    }
});

routes.get("/emptyCart", async (req, res) => {

    const user = req.user;

    try { 
        const cart = await Cart.findOne({ userId: user.id });

        if(!cart) return res.status(200).json({ "status": "Process Complete" });
    
        cart.items = [];
        cart.subTotal = 0;
    
        const cartSave = await cart.save();
    
        res.status(200).json({ "status": "Process Complete" });
    } catch(err) {
        console.log(err);
        res.sendStatus(500);
    }
})

module.exports = routes;