import { Link ,useNavigate} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useRef, useState } from "react";

export default function Navbar() {
  const { isLoggedIn, isBuyer, isSeller, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const firstLetter = user?.name?.charAt(0)?.toUpperCase();

  // ✅ Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      
      {/* Logo */}
      <Link to="/" className="text-xl font-bold text-blue-600">
        PriceCompare
      </Link>

      <div className="flex items-center gap-4">

        {/* NOT LOGGED IN */}
        {!isLoggedIn && (
          <Link to="/login" className="hover:text-blue-600">
            Login
          </Link>
        )}

        {/* PROFILE DROPDOWN */}
        {isLoggedIn && (
          <div className="relative" ref={dropdownRef}>
            
            {/* Avatar */}
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="w-10 h-10 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center"
            >
              {firstLetter}
            </button>

            {/* Dropdown */}
            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-md z-50">

                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>

                {/* ✅ BUYER → Become Seller */}
                {!isSeller && (
                  <Link
                    to="/become-seller"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Become Seller
                  </Link>
                )}

                {/* ✅ SELLER → Dashboard */}
                {isSeller && (
                  <Link
                    to="/dashboard"
                    onClick={() => setOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    setOpen(false);
                    navigate('/')
                  }}
                  className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                >
                  Logout
                </button>

              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
