import { Request, Response } from "express";
import mongoose from "mongoose";
import Product from "../models/products"; 

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Retrieve all products (optional filtering via query params)
 *     responses:
 *       200:
 *         description: A list of products
 *       404:
 *         description: No products found
 *       500:
 *         description: Server error
 */
export const getProducts = async (req: Request, res: Response) => {
  try {
    const filter = req.query;
    const products = await Product.find(filter);

    if (!products || products.length === 0) {
      return res.status(404).json({ message: "No products found" });
    }
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Retrieve a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product found
 *       400:
 *         description: Invalid id
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, brand, category, price]
 *             properties:
 *               name: { type: string }
 *               brand: { type: string }
 *               category: { type: string }
 *               price: { type: number }
 *               inStock: { type: boolean }
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Bad request
 *       500:
 *         description: Server error
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Product data is required" });
    }

    const { name, brand, category, price, inStock } = req.body;

    if (!name || !brand || !category || price === undefined) {
      return res
        .status(400)
        .json({ message: "Name, brand, category, and price are required" });
    }

    const created = await Product.create({ name, brand, category, price, inStock });
    return res.status(201).json({ message: "Product created successfully", product: created });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Update a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Bad request / invalid id
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id Parameter Missing" });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, {
      runValidators: true,
      new: true
    });

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product updated successfully", product: updatedProduct });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Remove a product by id
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 *       400:
 *         description: Bad request / invalid id
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Id Parameter Missing" });
    }

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Product not found" });

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: String(err) });
  }
};
