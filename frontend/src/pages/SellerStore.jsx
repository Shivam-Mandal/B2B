

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, MapPin, Package, Filter, ChevronDown, Star } from "lucide-react";
import { getOwnerProducts } from "../services/auth.api";

export default function SellerStore() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [stockFilter, setStockFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const productsPerPage = 12;

  if(token === null){
    navigate('/login');
  }

  useEffect(() => {
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
    if (!token) return;
    const fetchProducts = async () => {
      try {
        const res = await getOwnerProducts();

        if (Array.isArray(res.data.data)) {
          setProducts(res.data.data);
        } else if (res.data.data) {
          setProducts([res.data.data]);
        } else {
          setProducts([]);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else {
          setError("Failed to load products");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

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

  // Get unique categories
  const categories = ["all", ...new Set(products.map(p => p.category).filter(Boolean))];

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         p.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];
    const matchesStock = stockFilter === "all" || 
                        (stockFilter === "instock" && p.stock > 0) ||
                        (stockFilter === "outofstock" && p.stock === 0);
    
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-700 font-medium text-lg">Loading your store...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-4">
            <X className="w-10 h-10 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {companyName || "Store"}
                </h1>
              </div>

              {/* Search Bar - Desktop */}
              <div className="hidden md:flex flex-1 max-w-2xl mx-8">
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>
              </div>

              {/* Cart Icon */}
              <div className="flex items-center gap-4">
                <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ShoppingCart className="w-6 h-6 text-gray-700" />
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    0
                  </span>
                </button>
                <button 
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </button>
              </div>
            </div>

            {/* Search Bar - Mobile */}
            <div className="md:hidden pb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center text-sm text-gray-600">
              <span className="hover:text-blue-600 cursor-pointer">Home</span>
              <ChevronDown className="w-4 h-4 mx-2 rotate-[-90deg]" />
              <span className="text-gray-900 font-medium">{companyName || "Store"}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-gray-700" />
                <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat}
                        onChange={() => setSelectedCategory(cat)}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors capitalize">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-500">-</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Stock Filter */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
                <div className="space-y-2">
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="stock"
                      checked={stockFilter === "all"}
                      onChange={() => setStockFilter("all")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                      All Products
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="stock"
                      checked={stockFilter === "instock"}
                      onChange={() => setStockFilter("instock")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                      In Stock
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer group">
                    <input
                      type="radio"
                      name="stock"
                      checked={stockFilter === "outofstock"}
                      onChange={() => setStockFilter("outofstock")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-3 text-gray-700 group-hover:text-blue-600 transition-colors">
                      Out of Stock
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* Mobile Filters Overlay */}
          {showMobileFilters && (
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setShowMobileFilters(false)}>
              <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
                    <button onClick={() => setShowMobileFilters(false)}>
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  {/* Category Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Category</h4>
                    <div className="space-y-2">
                      {categories.map(cat => (
                        <label key={cat} className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="category-mobile"
                            checked={selectedCategory === cat}
                            onChange={() => setSelectedCategory(cat)}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="ml-3 text-gray-700 capitalize">{cat}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-6 pb-6 border-b border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 100000])}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>

                  {/* Stock Filter */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-3">Availability</h4>
                    <div className="space-y-2">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="stock-mobile"
                          checked={stockFilter === "all"}
                          onChange={() => setStockFilter("all")}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3 text-gray-700">All Products</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="stock-mobile"
                          checked={stockFilter === "instock"}
                          onChange={() => setStockFilter("instock")}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3 text-gray-700">In Stock</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="radio"
                          name="stock-mobile"
                          checked={stockFilter === "outofstock"}
                          onChange={() => setStockFilter("outofstock")}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="ml-3 text-gray-700">Out of Stock</span>
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowMobileFilters(false)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Results Header */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {filteredProducts.length} Products
                  </h2>
                  <p className="text-sm text-gray-600 mt-0.5">
                    Page {currentPage} of {totalPages || 1}
                  </p>
                </div>
                <button className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50">
                  <Filter className="w-4 h-4" />
                  Filters
                </button>
              </div>
            </div>

            {/* Products Grid */}
            {currentProducts.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters or search query</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                    setPriceRange([0, 100000]);
                    setStockFilter("all");
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {currentProducts.map((p) => (
                    <div
                      key={p._id}
                      onClick={() => openProductModal(p)}
                      className="group bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer border border-gray-200 hover:border-blue-300"
                    >
                      {/* Product Image */}
                      <div className="relative aspect-square bg-gray-100 overflow-hidden">
                        {p.images && p.images.length > 0 && p.images[0] ? (
                          <img
                            src={p.images[0]?.url || p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center">
                            <Package className="w-12 h-12 text-gray-300 mb-2" />
                            <p className="text-xs text-gray-400">No Image</p>
                          </div>
                        )}
                        
                        {/* Stock Badge */}
                        {p.stock > 0 ? (
                          <span className="absolute top-2 left-2 px-2 py-1 bg-green-500 text-white text-xs font-semibold rounded">
                            In Stock
                          </span>
                        ) : (
                          <span className="absolute top-2 left-2 px-2 py-1 bg-red-500 text-white text-xs font-semibold rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-3">
                        {/* Category */}
                        {p.category && (
                          <span className="inline-block px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded mb-2">
                            {p.category}
                          </span>
                        )}

                        {/* Product Name */}
                        <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem] group-hover:text-blue-600 transition-colors">
                          {p.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-2">
                          <div className="flex">
                            {[1,2,3,4].map(i => (
                              <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            ))}
                            <Star className="w-3 h-3 text-gray-300" />
                          </div>
                          <span className="text-xs text-gray-600">(4.0)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-xl font-bold text-gray-900">
                            ₹{p.price?.toLocaleString('en-IN')}
                          </span>
                          {p.minOrderQty > 1 && (
                            <span className="text-xs text-gray-500">
                              MOQ: {p.minOrderQty}
                            </span>
                          )}
                        </div>

                        {/* Location */}
                        {p.location?.city && (
                          <div className="flex items-center gap-1 text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span className="text-xs">{p.location.city}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      {[...Array(totalPages)].map((_, i) => {
                        const page = i + 1;
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                currentPage === page
                                  ? 'bg-blue-600 text-white'
                                  : 'border border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return <span key={page} className="px-2">...</span>;
                        }
                        return null;
                      })}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">{companyName || "Store"}</h3>
              <p className="text-sm text-gray-400">Your trusted partner for quality products and excellent service.</p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Customer Service</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">About</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 {companyName || "Store"}. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Product Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-5xl w-full my-8 shadow-2xl animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <h2 className="text-2xl font-bold text-gray-900">Product Details</h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Left: Images */}
                <div className="space-y-4">
                  <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
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
                        <Package className="w-24 h-24 text-gray-300 mb-4" />
                        <p className="text-gray-400">No Image Available</p>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {selectedProduct.images && selectedProduct.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.images.slice(1, 5).map((img, idx) => (
                        <div key={idx} className="aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
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

                {/* Right: Product Info */}
                <div className="space-y-6">
                  {/* Category & Stock Badge */}
                  <div className="flex items-center gap-3 flex-wrap">
                    {selectedProduct.category && (
                      <span className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg">
                        {selectedProduct.category}
                      </span>
                    )}
                    {selectedProduct.stock > 0 ? (
                      <span className="px-3 py-1.5 bg-green-100 text-green-800 text-sm font-semibold rounded-lg">
                        ✓ In Stock ({selectedProduct.stock} units)
                      </span>
                    ) : (
                      <span className="px-3 py-1.5 bg-red-100 text-red-800 text-sm font-semibold rounded-lg">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Product Name */}
                  <div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2">{selectedProduct.name}</h3>
                    
                    {/* Rating */}
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1,2,3,4].map(i => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                        <Star className="w-4 h-4 text-gray-300" />
                      </div>
                      <span className="text-sm text-gray-600">(4.0 rating)</span>
                    </div>
                  </div>

                  {/* Price Section */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-100">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-4xl font-bold text-blue-600">
                        ₹{selectedProduct.price?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-gray-500 line-through text-lg">
                        ₹{(selectedProduct.price * 1.3)?.toLocaleString('en-IN')}
                      </span>
                      <span className="text-green-600 font-semibold text-sm">23% off</span>
                    </div>
                    {selectedProduct.minOrderQty && selectedProduct.minOrderQty > 1 && (
                      <p className="text-sm text-gray-600">
                        Minimum Order: <span className="font-semibold">{selectedProduct.minOrderQty} units</span>
                      </p>
                    )}
                  </div>

                  {/* Description */}
                  {selectedProduct.description && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">About this product</h4>
                      <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                    </div>
                  )}

                  {/* Tags */}
                  {selectedProduct.tags && selectedProduct.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProduct.tags.map((tag, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location */}
                  {selectedProduct.location && (
                    <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedProduct.location.city}, {selectedProduct.location.state}
                        </p>
                        <p className="text-sm text-gray-600">{selectedProduct.location.country}</p>
                      </div>
                    </div>
                  )}

                  {/* Quantity Selector */}
                  <div className="border-t border-gray-200 pt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Select Quantity
                      </label>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleQuantityChange(quantity - 1)}
                          disabled={quantity <= (selectedProduct.minOrderQty || 1)}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(parseInt(e.target.value) || (selectedProduct.minOrderQty || 1))}
                          min={selectedProduct.minOrderQty || 1}
                          max={selectedProduct.stock}
                          className="w-24 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        />
                        <button
                          onClick={() => handleQuantityChange(quantity + 1)}
                          disabled={quantity >= selectedProduct.stock}
                          className="w-12 h-12 rounded-lg border-2 border-gray-300 flex items-center justify-center text-xl font-bold text-gray-700 hover:bg-gray-50 hover:border-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total Price */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <span className="text-gray-700 font-medium">Total Amount</span>
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleOrder}
                      disabled={selectedProduct.stock === 0}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {selectedProduct.stock === 0 ? 'Out of Stock' : 'Place Order'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
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