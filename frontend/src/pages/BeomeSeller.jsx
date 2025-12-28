import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function BecomeSeller() {
  const navigate = useNavigate();
  const { token, user, login } = useAuth();

  const [company, setCompany] = useState({
    companyName: "",
    businessType: "",
    description: "",
    gstNumber: "",
    establishedYear: "",
    website: "",
    address: {
      city: "",
      state: "",
      country: "India",
      pincode: "",
    },
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in company.address) {
      setCompany({
        ...company,
        address: {
          ...company.address,
          [name]: value,
        },
      });
    } else {
      setCompany({
        ...company,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!company.companyName.trim())
      newErrors.companyName = "Company name is required";

    if (!company.businessType.trim())
      newErrors.businessType = "Business type is required";

    if (!company.address.city.trim())
      newErrors.city = "City is required";

    if (!company.address.state.trim())
      newErrors.state = "State is required";

    if (company.establishedYear && !/^\d{4}$/.test(company.establishedYear)) {
      newErrors.establishedYear = "Enter a valid year";
    }

    if (company.website && !/^https?:\/\/.+\..+/.test(company.website)) {
      newErrors.website = "Invalid website URL";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setServerError("");

    try {
      await axios.post(
        "http://localhost:8080/api/v1/company",
        company,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Update role locally to seller
      login({
        token,
        user: { ...user, role: "seller" },
      });

      navigate("/");

    } catch (err) {
      setServerError(
        err.response?.data?.message || "Failed to submit company details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">

        <h2 className="text-2xl font-bold text-center mb-6">
          Company Details
        </h2>

        {serverError && (
          <p className="text-red-600 text-center mb-3">
            {serverError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Company Name */}
          <input
            name="companyName"
            placeholder="Company Name"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm">{errors.companyName}</p>
          )}

          {/* Business Type */}
          <input
            name="businessType"
            placeholder="Business Type"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />
          {errors.businessType && (
            <p className="text-red-500 text-sm">{errors.businessType}</p>
          )}

          {/* Description */}
          <textarea
            name="description"
            placeholder="Company Description"
            className="w-full border p-3 rounded"
            rows="3"
            onChange={handleChange}
          />

          {/* GST Number */}
          <input
            name="gstNumber"
            placeholder="GST Number"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          {/* Established Year */}
          <input
            name="establishedYear"
            placeholder="Established Year (YYYY)"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />
          {errors.establishedYear && (
            <p className="text-red-500 text-sm">{errors.establishedYear}</p>
          )}

          {/* Website */}
          <input
            name="website"
            placeholder="Website URL"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />
          {errors.website && (
            <p className="text-red-500 text-sm">{errors.website}</p>
          )}

          {/* Address */}
          <div className="grid grid-cols-2 gap-3">
            <input
              name="city"
              placeholder="City"
              className="border p-3 rounded"
              onChange={handleChange}
            />
            <input
              name="state"
              placeholder="State"
              className="border p-3 rounded"
              onChange={handleChange}
            />
          </div>

          {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}

          <input
            name="pincode"
            placeholder="Pincode"
            className="w-full border p-3 rounded"
            onChange={handleChange}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {loading ? "Submitting..." : "Submit Company Details"}
          </button>
        </form>
      </div>
    </div>
  );
}
