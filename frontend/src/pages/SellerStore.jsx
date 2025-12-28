import { useEffect, useState } from "react";
import axios from "axios";

export default function SellerStore() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

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
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/products/random`
        );

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

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setQuantity(product.minOrderQty || 1);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setQuantity(1);
  };

  const handleQuantityChange = (newQty) => {
    const minQty = selectedProduct?.minOrderQty || 1;
    if (newQty >= minQty && newQty <= selectedProduct?.stock) {
      setQuantity(newQty);
    }
  };

  const handleOrder = () => {
    alert(`Order placed for ${quantity} units of ${selectedProduct?.name}`);
    closeModal();
  };

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
              <div 
                key={p._id} 
                onClick={() => openProductModal(p)}
                className="group bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer"
              >
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                  {p.images && p.images.length > 0 && p.images[0] ? (
                    <img
                      src={p.images[0]?.url || p.images[0]}
                      alt={p.images[0]?.alt || p.name}
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
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 shadow-sm">
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 shadow-sm">
                        Out of Stock
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="p-5">
                  {/* Category Tag */}
                  {p.category && (
                    <span className="inline-block px-2.5 py-1 mb-3 text-xs font-medium bg-blue-50 text-blue-700 rounded-md">
                      {p.category}
                    </span>
                  )}
                  
                  {/* Product Name */}
                  <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2 min-h-[3.5rem] group-hover:text-blue-600 transition-colors">
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

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fadeIn" onClick={closeModal}>
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-slideUp" onClick={(e) => e.stopPropagation()}>
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
              <button 
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                
                {/* Product Image */}
                <div className="space-y-4">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
                    {selectedProduct.images && selectedProduct.images.length > 0 && selectedProduct.images[0] ? (
                      <img
                        src={selectedProduct.images[0]?.url || selectedProduct.images[0]}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <svg className="w-24 h-24 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        <p className="text-gray-400">No Image Available</p>
                      </div>
                    )}
                  </div>
                  
                  {/* Thumbnail Images */}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(1, 5).map((img, idx) => (
                        <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={img?.url || img}
                            alt={`${selectedProduct.name} ${idx + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-6">
                  
                  {/* Category & Stock */}
                  <div className="flex items-center gap-3">
                    {selectedProduct.category && (
                      <span className="inline-block px-3 py-1.5 text-sm font-medium bg-blue-50 text-blue-700 rounded-md">
                        {selectedProduct.category}
                      </span>
                    )}
                    {selectedProduct.stock > 0 ? (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                        ✓ In Stock ({selectedProduct.stock} units)
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-800">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <h3 className="text-3xl font-bold text-gray-900">{selectedProduct.name}</h3>

                  {/* Price */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="text-4xl font-bold text-blue-600">
                      ₹{selectedProduct.price?.toLocaleString('en-IN')}
                    </p>
                    {selectedProduct.minOrderQty && selectedProduct.minOrderQty > 1 && (
                      <p className="text-sm text-gray-600 mt-2">
                        Minimum Order Quantity: <span className="font-semibold">{selectedProduct.minOrderQty} units</span>
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">Description</h4>
                      <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {selectedProduct.location && (
                    <div className="flex items-start gap-2 text-gray-600">
                      <svg className="w-5 h-5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <div>
                        <p className="font-medium text-gray-900">{selectedProduct.location.city}, {selectedProduct.location.state}</p>
                        <p className="text-sm">{selectedProduct.location.country}</p>
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="border-t border-gray-200 pt-6">
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Quantity
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleQuantityChange(quantity - 1)}
                        disabled={quantity <= (selectedProduct.minOrderQty || 1)}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || (selectedProduct.minOrderQty || 1))}
                        min={selectedProduct.minOrderQty || 1}
                        max={selectedProduct.stock}
                        className="w-20 h-10 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                      />
                      <button
                        onClick={() => handleQuantityChange(quantity + 1)}
                        disabled={quantity >= selectedProduct.stock}
                        className="w-10 h-10 rounded-lg border-2 border-gray-300 flex items-center justify-center font-bold text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        +
                      </button>
                      <div className="ml-auto">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-2xl font-bold text-gray-900">
                          ₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Order Button */}
                  <button
                    onClick={handleOrder}
                    disabled={selectedProduct.stock === 0}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:cursor-not-allowed"
                  >
                    {selectedProduct.stock === 0 ? 'Out of Stock' : 'Place Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(20px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}