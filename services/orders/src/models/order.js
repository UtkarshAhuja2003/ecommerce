const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ORDER_STATUS } = require('../constants');

const orderSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  products: [
    {
      productId: {
        type: String,
        required: [true, 'Product ID is required']
      },
      quantity: {
        type: Number,
        required: [true, 'Product quantity is required'],
        min: [1, 'Quantity must be at least 1']
      },
      priceAtPurchase: {
        type: Number,
        required: [true, 'Product price at purchase time is required'],
        min: [0, 'Price cannot be negative'],
        validate: {
          validator: Number.isFinite,
          message: 'Price must be a valid number'
        }
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: [true, 'Total order amount is required'],
    min: [0, 'Total amount cannot be negative'],
    validate: {
      validator: Number.isFinite,
      message: 'Total amount must be a valid number'
    }
  },
  status: {
    type: String,
    required: [true, 'Order status is required'],
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PLACED
  }
}, {
  timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
