export default function MyProducts() {
  const products = [
    { id: 1, name: "iPhone 15", price: 72000, stock: 5 },
    { id: 2, name: "Samsung S23", price: 68000, stock: 0 }
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">
        My Products
      </h2>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Stock</th>
            </tr>
          </thead>

          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.name}</td>
                <td className="p-3">₹{p.price}</td>
                <td className="p-3">
                  {p.stock > 0 ? "In Stock" : "Out of Stock"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
