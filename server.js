
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('./utils/authUtil');
require('./db');

const app = express();

app.use(logger('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/test', (req, res) => {
    res.status(200).json({"message" : "Success!!!!"});
});

app.use('/auth/api',  authRoutes);

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
})