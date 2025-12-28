export default function AddProduct() {
  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-bold mb-6">
        Add New Product
      </h2>

      <form className="bg-white p-6 rounded shadow space-y-4">

        <input
          placeholder="Product Name"
          className="w-full border p-3 rounded"
        />

        <input
          placeholder="Category"
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border p-3 rounded"
        />

        <input
          type="number"
          placeholder="Stock Quantity"
          className="w-full border p-3 rounded"
        />

        <input
          placeholder="Image URL"
          className="w-full border p-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}
