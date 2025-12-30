import { useNavigate } from "react-router-dom";
import { useState } from "react";
import EnquiryModal from "./EnquiryModal";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [openEnquiry, setOpenEnquiry] = useState(false);

  return (
    <>
      <div className="rounded-lg p-4 bg-white group">
        
        {/* Image */}
        <div className="overflow-hidden rounded-md mb-3">
          <img
            src={product.image || "https://via.placeholder.com/150"}
            alt={product.productName}
            className="
              h-40 w-full object-contain
              transition-transform duration-300
              group-hover:scale-110
            "
          />
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
          {product.productName}
        </h3>
        <h3 className="font-semibold text-sm mb-1 line-clamp-2">
          {product.price ? `Rs.${product.price}` : "Price on request"}
        </h3>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-600 text-white text-xs px-2 py-0.5 rounded">
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

        {/* Buttons Row */}
        <div className="flex gap-2">
          <button
            onClick={() => setOpenEnquiry(true)}
            className="flex-1 border border-blue-600 text-blue-600 py-2 rounded text-sm hover:bg-blue-50"
          >
            Enquiry
          </button>

          <button
            onClick={() => navigate(`/compare/${product._id}`)}
            className="flex-1 bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700"
          >
            Compare
          </button>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        open={openEnquiry}
        onClose={() => setOpenEnquiry(false)}
        productName={product.productName}
      />
    </>
  );
}
