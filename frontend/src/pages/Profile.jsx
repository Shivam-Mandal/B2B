import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Profile() {
    const { token } = useAuth();

    const [user, setUser] = useState(null);
    const [company, setCompany] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                // ✅ 1️⃣ FETCH USER
                const userRes = await axios.get(
                    `${import.meta.env.VITE_API_BASE_URL}/api/v1/users/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const fetchedUser = userRes.data;
                setUser(fetchedUser);

                // ✅ 2️⃣ FETCH COMPANY ONLY IF ONBOARDING COMPLETED
                if (fetchedUser.onboardingCompleted) {
                    const companyRes = await axios.get(
                        `${import.meta.env.VITE_API_BASE_URL}/api/v1/company/me`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    setCompany(companyRes.data.company);
                }
            } catch (err) {
                // console.error(err);
                setError("Failed to load profile data"); //yet to be fixed its a bug
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [token]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading profile...
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                User not found
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex justify-center py-10">
            <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-8 space-y-6">

                <h2 className="text-2xl font-bold">Profile</h2>

                {/* USER INFO */}
                <div className="border rounded p-5 space-y-2">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                        User Information

                        {/* ✅ VERIFIED BADGE */}
                        {user.onboardingCompleted && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Verified Seller
                            </span>
                        )}
                    </h3>

                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Phone:</strong> {user.phone}</p>
                    <p>
                        <strong>Role:</strong>{" "}
                        <span className="capitalize">{user.role}</span>
                    </p>
                </div>

                {/* ❌ ONBOARDING NOT COMPLETED */}
                {!user.onboardingCompleted && (
                    <div className="border rounded p-5 text-center space-y-4">
                        <p className="text-gray-700">
                            Complete seller onboarding to add your company details.
                        </p>

                        <Link
                            to="/become-seller"
                            className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                        >
                            Complete Seller Onboarding
                        </Link>
                    </div>
                )}

                {/* ✅ COMPANY INFO */}
                {user.onboardingCompleted && company && (
                    <div className="border rounded p-5 space-y-2">
                        <h3 className="text-lg font-semibold">Company Information</h3>

                        <p><strong>Company Name:</strong> {company.companyName}</p>
                        <p><strong>Business Type:</strong> {company.businessType}</p>

                        {company.description && (
                            <p><strong>Description:</strong> {company.description}</p>
                        )}

                        {company.gstNumber && (
                            <p><strong>GST Number:</strong> {company.gstNumber}</p>
                        )}
                        <p>
                            <strong>Store Link:</strong>{" "}
                            <Link
                                to={`http://localhost:5173/store/${company.companyName
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                            >
                                http://localhost:5173/store/{company.companyName
                                    .toLowerCase()
                                    .replace(/\s+/g, "-")}
                            </Link>
                        </p>

                        <p>
                            <strong>Verification Status:</strong>{" "}
                            {company.isVerified ? "Verified ✅" : "Pending ❌"}
                        </p>
                    </div>
                )}

                {error && (
                    <p className="text-red-600 text-center">{error}</p>
                )}
            </div>
        </div>
    );
}
