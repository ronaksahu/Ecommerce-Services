if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}
const mongoose = require('mongoose');

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    poolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4
};

mongoose.connect(process.env.MONGO_DB_URL, options ).then(
    () => console.log('Connected to DB!!'),
    err => console.log(`Not able to connect to db ${err}`)
)