import Product from "../models/product.model.js";
import Company from "../models/seller.model.js";

/**
 * SELLER: Create Product
 */
export const createProduct = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get seller company
    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({
        success: false,
        message: "Company not found. Complete company onboarding first.",
      });
    }

    // Check if a product with the same name already exists for this seller
    const existingProduct = await Product.findOne({
      name: req.body.name,
      sellerCompany: company._id,
    });
    if (existingProduct) {
      return res.status(409).json({
        success: false,
        message: "A product with this name already exists for your company.",
      });
    }

    const images = req.files?.map(file => ({
      url: file.path,        
      public_id: file.filename,
    })) || [];

    const product = await Product.create({
      ...req.body,
      sellerCompany: company._id,
      images
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Product with same name already exists"
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* SELLER: Get my products */
export const updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const { sellerCompany, ...safeBody } = req.body;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerCompany: company._id },
      safeBody,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* SELLER: Get all products of logged-in seller */
export const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, sellerCompany: company._id },
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found or unauthorized",
      });
    }

    res.json({
      success: true,
      message: "Product removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* SELLER: Get all products of logged-in seller */
export const getSellerProducts = async (req, res) => {
  try {
    const userId = req.user.id;

    const company = await Company.findOne({ owner: userId });
    if (!company) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const products = await Product.find({
      sellerCompany: company._id,
    });

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* BUYER: Get random products */
export const getRandomProducts = async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 12;

    const products = await Product.aggregate([
      { $match: { isActive: true } },
      { $sample: { size: limit } },
    ]);

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* BUYER: Get products by category */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const products = await Product.find({
      category,
      isActive: true,
    }).populate("sellerCompany", "companyName address.city");

    res.json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


/* BUYER: Filter & search products */
export const filterProducts = async (req, res) => {
  try {
    const {
      keyword,
      category,
      minPrice,
      maxPrice,
      tags,
      city,
      sort = "-createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    const query = { isActive: true };

    if (category) query.category = category;
    if (city) query["sellerCompany.address.city"] = city;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (tags) {
      query.tags = { $in: tags.split(",") };
    }

    if (keyword) {
      query.$text = { $search: keyword };
    }

    const skip = (page - 1) * limit;

    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate("sellerCompany", "companyName address.city");

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const redirectToSeller = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("sellerCompany", "subdomain");
    if (!product || !product.sellerCompany) {
      return res.status(404).json({ message: "Product or seller not found" });
    }
    const subdomain = product.sellerCompany.subdomain;
    const redirectUrl = `https://${subdomain}.yourapp.com/product/${product._id}`;
    res.redirect(redirectUrl);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

