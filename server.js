
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utils/authUtil');
const sellerAuth = require('./routes/sellerAuth');
const productRoutes = require('./routes/productRoute');
const userProdRoute = require('./routes/userProductRoute');
const userAuthRoutes = require('./routes/userAuthRoutes');
require('./db');

const app = express();

app.use(logger('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.status(200).json({"message" : "Success!!!!"});
});

app.use('/user/auth/api',  authRoutes);

app.use('/seller/auth/api',  sellerAuth);

app.use('/product/seller/api', authenticateToken, productRoutes);

app.use('/product/user/api', userProdRoute);

app.use('/auth/user', authenticateToken, userAuthRoutes);

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})