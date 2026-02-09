import mongoose, { Schema } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name Required"],
  },
  brand: {
    type: String,
    required: [true, "Brand Required"],
  },
  category: {
    type: String,
    required: [true, "Category Required"],
  },
  price: {
    type: Number,
    required: [true, "Price Required"],
    min: [0, "Price cannot be negative"],
  },
  inStock: {
    type: Boolean,
    default: true,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
