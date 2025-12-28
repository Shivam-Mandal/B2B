import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SearchResult from "./pages/SearchResult";
import ProductCompare from "./pages/ProductCompare";
import SellerPage from "./pages/SellerPage";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerDashboard from "./pages/SellerDashboard";
import BecomeSeller from "./pages/BeomeSeller";
import Profile from "./pages/Profile";
import SellerStore from "./pages/SellerStore";




export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResult />} />
        <Route path="/compare/:id" element={<ProductCompare />} />
        <Route path="/seller/:slug" element={<SellerPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/become-seller" element={<BecomeSeller />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/store/:slug" element={<SellerStore />} />

      </Routes>
    </BrowserRouter>
  );
}
