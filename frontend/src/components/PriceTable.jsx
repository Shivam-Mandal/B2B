import { Link } from "react-router-dom";

export default function PriceTable({ sellers }) {
  if (!sellers.length) return null;

  const lowestPrice = Math.min(...sellers.map(s => s.price));

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Seller</th>
            <th className="p-3 text-left">Price</th>
            <th className="p-3 text-left">Delivery</th>
            <th className="p-3 text-left">Store</th>
          </tr>
        </thead>

        <tbody>
          {sellers.map((s) => (
            <tr
              key={s.sellerId}
              className={`border-t ${
                s.price === lowestPrice ? "bg-green-50" : ""
              }`}
            >
              <td className="p-3 font-medium">
                {s.sellerName}
                {s.price === lowestPrice && (
                  <span className="ml-2 text-xs text-green-600 font-semibold">
                    Lowest Price
                  </span>
                )}
              </td>

              <td className="p-3 font-semibold">
                ₹{s.price}
              </td>

              <td className="p-3">
                {s.deliveryTime} days
              </td>

              <td className="p-3">
                <Link
                  to={`/seller/${s.sellerSlug}`}
                  className="text-blue-600 hover:underline"
                >
                  Visit Store
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
