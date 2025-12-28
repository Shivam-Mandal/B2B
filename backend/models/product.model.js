import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 3,
      maxlength: 120
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"]
    },
    category: {
      type: String,
      required: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      maxlength: 2000
    },
    images: [
      {
        url: String,
        alt: String
      }
    ],
    stock: {
      type: Number,
      default: 0,
      min: 0
    },
    isActive: {
      type: Boolean,
      default: true
    },
    minOrderQty: {
      type: Number,
      default: 1
    },
    tags: {
      type: [String],
      index: true
    },
    location: {
      city: String,
      state: String,
      country: {
        type: String,
        default: "India"
      }
    }
  },
  {
    timestamps: true
  }
);
productSchema.index({ name: "text", description: "text", tags: "text" });
productSchema.pre("save", function (next) {
  if (!this.isModified("name")) return next();
  this.slug = this.name.toLowerCase().replace(/ /g, "-");
  next();
});
export default mongoose.model("Product", productSchema);
