export default function DashboardHome() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Seller Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-600">Total Products</h3>
          <p className="text-2xl font-bold">12</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-600">Active Listings</h3>
          <p className="text-2xl font-bold">10</p>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-gray-600">Out of Stock</h3>
          <p className="text-2xl font-bold">2</p>
        </div>

      </div>
    </div>
  );
}
