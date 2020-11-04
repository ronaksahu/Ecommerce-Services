const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
    sellerName: {
        type: String,
        required: true,
        trim: true
    },
    sellerEmail: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7
    },
    sellerContactNo: {
        type: Number,
        required: true,
        unique: true
    },
    sellerShopName: {
        type: String
    },
    address: {
        city: { type: String, required: true },
        state: { type: String, required: true },
        address: { type: String, required: true },
        pinCode: { type: Number, required: true }
    }
}, { timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
}
});

SellerSchema.pre('save', function(next) {

    const seller = this;

    if(!seller.isModified('password')) return next();

    bcrypt.genSalt(4, function(err, salt) {
        bcrypt.hash(seller.password, salt, (err, hash) => {
            if (err) return next(err);
            seller.password = hash;
            next();
    
        });
    });
});

module.exports = mongoose.model('Seller', SellerSchema);