import { useState } from "react";

export default function EnquiryModal({ open, onClose, productName }) {
  const [error, setError] = useState("");

  if (!open) return null;

  const validateMobile = (mobile) => {
    const regex = /^[6-9]\d{9}$/;
    return regex.test(mobile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.target;

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      mobile: form.mobile.value.trim(),
      message: form.message.value.trim(),
      product: productName
    };

    // ❌ Mobile validation
    if (!validateMobile(data.mobile)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    // ✅ All validations passed
    console.log("Enquiry Submitted:", data);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          Product Enquiry
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Name */}
          <input
            name="name"
            placeholder="Your Name"
            required
            className="w-full border p-2 rounded"
          />

          {/* Email */}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            className="w-full border p-2 rounded"
          />

          {/* Mobile (STRICT) */}
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="10"
            onChange={(e) => {
              e.target.value = e.target.value.replace(/\D/g, "");
            }}
            required
            className="w-full border p-2 rounded"
          />

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600">
              {error}
            </p>
          )}

          {/* Message */}
          <textarea
            name="message"
            rows="3"
            defaultValue={`I am interested in ${productName}`}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Send Enquiry
          </button>
        </form>
      </div>
    </div>
  );
}
