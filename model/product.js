const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    productName: {
        type: String,
        required: true,
        minlength: 3,
        trim: true,
        index
    },
    price: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
    },
    description: {
        type: String
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'Seller',
        required: true
    }

},
{
    timestamps: { 
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
     }
});

module.exports = mongoose.model('Product', ProductSchema);