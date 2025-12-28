import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const navigate = useNavigate();

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition">
      
      <img
        src={product.image || "https://via.placeholder.com/150"}
        alt={product.productName}
        className="h-40 w-full object-contain mb-4"
      />

      <h3 className="font-semibold text-lg mb-2">
        {product.productName}
      </h3>

      <p className="text-sm text-gray-600 mb-3">
        {product.category}
      </p>

      <button
        onClick={() => navigate(`/compare/${product._id}`)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Compare Prices
      </button>
    </div>
  );
}
