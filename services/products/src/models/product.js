const mongoose = require('mongoose');
const { Schema } = mongoose;
const { PRODUCT_CATEGORIES } = require("../constants");

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minLength: [2, 'Product name should be at least 2 characters'],
    maxLength: [200, 'Product name should be less than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minLength: [10, 'Description should be at least 10 characters'],
    maxLength: [1000, 'Description should be less than 1000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: Number.isFinite,
      message: 'Price must be a valid number'
    }
  },
  inventory: {
    type: Number,
    required: [true, 'Inventory count is required'],
    min: [0, 'Inventory cannot be negative'],
    default: 0
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    trim: true,
    enum: Object.values(PRODUCT_CATEGORIES),
    default: PRODUCT_CATEGORIES.OTHER
  }
}, {
  timestamps: true
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
