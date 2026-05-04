import mongoose from 'mongoose';

const quoteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String },
  notes: { type: String },
  items: [{
    productId: { type: String, required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalEstimatedPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Contacted', 'Fulfilled'], 
    default: 'Pending' 
  }
}, { timestamps: true });

const Quote = mongoose.model('Quote', quoteSchema);
export default Quote;
