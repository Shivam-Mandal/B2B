import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition bg-white">
      
      {/* Product Image */}
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.productName}
        className="h-40 w-full object-contain mb-3"
      />

      {/* Product Name */}
      <h3 className="font-semibold text-sm mb-1 line-clamp-2">
        {product.productName}
      </h3>

      {/* Rating Row */}
      {product.rating && (
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded font-semibold">
            {product.rating} ★
          </span>
          <span className="text-xs text-gray-600">
            {product.reviews}
          </span>
        </div>
      )}

      {/* Highlights */}
      {product.highlights && (
        <ul className="text-xs text-gray-700 mb-3 list-disc pl-4 space-y-1">
          {product.highlights.slice(0, 3).map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      )}

      {/* Action Button */}
      <button
        onClick={() => navigate(`/compare/${product._id}`)}
        className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
      >
        Compare Prices
      </button>
    </div>
  );
}
