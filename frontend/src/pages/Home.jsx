import SearchBar from "../components/SearchBar";

export default function Home() {
  return (
    <div className="px-6">
      
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg mt-6">
        <h1 className="text-4xl font-bold mb-4">
          Compare Prices from Multiple Sellers
        </h1>
        <p className="text-lg mb-6">
          Search once. Choose the best deal.
        </p>

        <div className="max-w-xl mx-auto">
          <SearchBar />
        </div>
      </section>

      {/* Categories */}
      <section className="mt-16">
        <h2 className="text-2xl font-semibold mb-6">Popular Categories</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["Mobiles", "Laptops", "Electronics", "Fashion"].map(cat => (
            <div
              key={cat}
              className="border p-6 rounded-lg text-center hover:shadow-lg cursor-pointer"
            >
              <h3 className="font-medium">{cat}</h3>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
