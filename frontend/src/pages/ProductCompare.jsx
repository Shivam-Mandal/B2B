import { useParams } from "react-router-dom";
import PriceTable from "../components/PriceTable";
import { comparisons } from "../mocks/comparisons";

export default function ProductCompare() {
  const { id } = useParams();
  const data = comparisons[id];

  if (!data) {
    return <p className="text-center mt-10">No comparison data available</p>;
  }

  const { product } = data;

  return (
    <div className="px-6 mt-10 max-w-6xl mx-auto">
      
      {/* Product Top Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.productName}
            className="w-64 h-64 object-contain"
          />
        </div>

        {/* Product Info + Highlights */}
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-2">
            {product.productName}
          </h1>

          <p className="text-gray-600 mb-4">
            {product.description}
          </p>

          {/* Highlights Section */}
          <div className="mt-4">
            <h3 className="font-semibold mb-2 text-gray-800">
              Highlights
            </h3>

            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              {product.highlights.map((item, index) => (
                <li key={index}>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Price Comparison Table */}
      <PriceTable sellers={data.sellers} />
    </div>
  );
}
