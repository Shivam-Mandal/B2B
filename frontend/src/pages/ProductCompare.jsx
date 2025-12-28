import { useParams } from "react-router-dom";
import PriceTable from "../components/PriceTable";
import { comparisons } from "../mocks/comparisons";

export default function ProductCompare() {
  const { id } = useParams();
  const data = comparisons[id];

  if (!data) {
    return <p className="text-center mt-10">No comparison data available</p>;
  }

  return (
    <div className="px-6 mt-10 max-w-6xl mx-auto">
      
      <div className="flex gap-6 mb-8">
        <img
          src={data.product.image}
          className="w-48 h-48 object-contain"
        />
        <div>
          <h1 className="text-3xl font-bold">
            {data.product.productName}
          </h1>
          <p className="text-gray-600">
            {data.product.description}
          </p>
        </div>
      </div>

      <PriceTable sellers={data.sellers} />
    </div>
  );
}
