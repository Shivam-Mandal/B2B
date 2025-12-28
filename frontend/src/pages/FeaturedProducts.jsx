import ProductCard from "../components/ProductCard";
import { useState, useEffect } from "react";
import { getRandomProducts } from "../services/api";

export default function FeaturedProducts() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getRandomProducts();
        setFeaturedProducts(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch featured products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <section className="bg-gray-50 py-14">
      <div className="max-w-cover-full mx-auto px-4 sm:px-6">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Featured Products
          </h2>

          <span className="text-sm text-gray-500">
            Handpicked for you
          </span>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-gray-200 rounded-lg animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && featuredProducts.length === 0 && (
          <p className="text-center text-gray-500">
            No featured products available
          </p>
        )}

        {/* Product Grid */}
        {!loading && featuredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <div
                key={product._id}
                className="transform transition hover:-translate-y-1 hover:shadow-lg"
              >
                <ProductCard
                  product={{
                    ...product,
                    productName: product.name,
                    image: product.images?.[0]?.url
                  }}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
