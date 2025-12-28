import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");

  useEffect(() => {
    // Extract company name from URL
    const pathSegments = window.location.pathname.split('/');
    const storeIndex = pathSegments.indexOf('store');
    if (storeIndex !== -1 && pathSegments[storeIndex + 1]) {
      const name = pathSegments[storeIndex + 1]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      setCompanyName(name);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/products`
        );

        console.log("API RESPONSE:", res.data);

        if (Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else if (res.data.data) {
          setProducts([res.data.data]);
        } else {
          setProducts([]);
        }
      } catch (err) {
        setError("Products not found");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Company Header */}
        <div className="mb-12 pb-8 border-b-2 border-gray-200">
          <h1 className="text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {companyName || "Store"}
            </span>
          </h1>
          <p className="text-gray-600 text-lg">Browse our product catalog</p>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Products</h2>
            <p className="mt-1 text-sm text-gray-600">{products.length} {products.length === 1 ? 'product' : 'products'} available</p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200 shadow-sm">
            <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <p className="mt-4 text-lg text-gray-600">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p._id} className="group bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                  {p.images && p.images.length > 0 && p.images[0] ? (
                    <img
                      src={typeof p.images[0] === 'string' ? p.images[0] : p.images[0].url}
                      alt={p.name || "Product"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center">
                      <svg className="w-20 h-20 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                      <p className="text-sm text-gray-400 font-medium">No Image</p>
                    </div>
                  )}
                  
                  {/* Stock Badge */}
                  <div className="absolute top-3 right-3">
                    {p.stock > 0 ? (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-5">
                  {/* Category Tag */}
                  {p.category && (
                    <span className="inline-block px-2.5 py-1 mb-3 text-xs font-medium bg-blue-50 text-blue-700 rounded">
                      {p.category}
                    </span>
                  )}
                  
                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                    {p.name}
                  </h3>
                  
                  {/* Description */}
                  {p.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {p.description}
                    </p>
                  )}
                  
                  {/* Price and MOQ */}
                  <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        ₹{p.price?.toLocaleString('en-IN')}
                      </p>
                      {p.minOrderQty && p.minOrderQty > 1 && (
                        <p className="text-xs text-gray-500 mt-1">
                          MOQ: {p.minOrderQty} units
                        </p>
                      )}
                    </div>
                    
                    {/* Location */}
                    {p.location?.city && (
                      <div className="text-right">
                        <p className="text-xs text-gray-500 flex items-center justify-end">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {p.location.city}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}