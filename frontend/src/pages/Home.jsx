import SearchBar from "../components/SearchBar";
// import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
// import { getRandomProducts } from "../services/api";
import FeaturedProducts from "./FeaturedProducts";

export default function Home() {
  // const [featuredProducts, setFeaturedProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const res = await getRandomProducts();
  //       setFeaturedProducts(res.data.data || []);
  //     } catch (err) {
  //       console.error("Failed to fetch featured products", err);
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  return (
    <div className="px-6">
      
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg mt-6">
        <h1 className="text-4xl font-bold mb-4">
          Compare Prices from Multiple Sellers
        </h1>
        <p className="text-lg mb-6">
          Search once. Choose the best deal.
        </p>

        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Categories */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Popular Categories</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Mobiles", "Laptops", "Electronics", "Fashion"].map(cat => (
            <div
              key={cat}
              className="border p-6 rounded-lg text-center hover:shadow-lg cursor-pointer"
            >
              <h3 className="font-medium">{cat}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {/* <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Featured Products</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredProducts.map(product => (
            <ProductCard
              key={product._id}
              product={{
                ...product,
                productName: product.name,
                image: product.images?.[0]?.url
              }}
            />
          ))}
        </div>
      </section> */}
      
      <FeaturedProducts />
    </div>
  );
}
