import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
      enum: ['Fertilizer', 'Pesticide', 'Micronutrient'],
    },
    subCategory: {
      type: String,
      trim: true,
    },
    basePricePKR: {
      type: Number,
      required: [true, 'Base price in PKR is required'],
      min: [0, 'Price cannot be negative'],
    },
    unitSize: {
      type: String,
      required: [true, 'Unit size is required'],
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    activeIngredients: {
      type: [String],
      default: [],
    },
    targetCrops: {
      type: [String],
      default: [],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
      default: 'https://via.placeholder.com/300?text=HaariYaari+Product',
    },
    sdsDocumentUrl: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Add a compound text index on name, category, and targetCrops for search functionality
productSchema.index({ name: 'text', category: 'text', targetCrops: 'text' });

const Product = mongoose.model('Product', productSchema);

export default Product;
