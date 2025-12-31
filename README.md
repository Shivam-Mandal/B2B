

# 🛒 B2B Multi-Vendor Price Comparison Platform

### *Search • Compare • Enquire • Connect Buyers & Sellers*

This repository contains a **full-stack B2B multi-vendor price comparison web application** developed using **React (Vite), Node.js, Express, MongoDB Atlas, and Cloudinary**.

The platform enables users to **search products, compare prices from multiple sellers, view seller-specific product pages, and send enquiries directly to sellers**, all within a single unified system.

> 🚀 **Live Demo**: *((https://b2-b-weld.vercel.app/)*

---

## 📌 About the Project

In modern B2B marketplaces, buyers often need to visit multiple platforms to compare prices, while small and medium sellers struggle to maintain their own independent websites.

This project addresses these challenges by providing:

* A **centralized product search and comparison system**
* **Multi-seller product listings under a parent domain**
* **Auto-generated seller storefront pages**
* A **buyer enquiry system** for direct seller communication
* A **scalable full-stack architecture** suitable for real-world deployment

The frontend and backend were developed collaboratively in the **same repository** as part of a **group internship project**, following industry-standard full-stack development practices.

---

## 🎨 Design Inspiration & Reference

The **UI/UX flow and marketplace structure** of this project were inspired by **IndiaMART**, one of India’s largest B2B marketplaces.

### Why IndiaMART?

* Strong **enquiry-based commerce model**
* Multi-seller listings for the same product
* Clear buyer–seller interaction flow
* Effective categorization and discovery patterns

⚠️ **Disclaimer**
This project is **not a clone of IndiaMART**.
IndiaMART was used **only as a design and UX reference**. All layouts, components, logic, and code were **custom-designed and implemented**.

---

## 🧩 Design Process (Mockup → Implementation)

Before writing production code, the application UI and user flow were planned using **Excalidraw**.

### 📝 Step 1: Low-Fidelity Wireframe (Excalidraw)

* Planned landing page layout
* Defined major sections:

  * Navbar & Login
  * Search area
  * Carousel
  * Categories
  * Featured products
  * Footer
* Focused on information hierarchy and usability

> <img width="1052" height="1159" alt="image" src="https://github.com/user-attachments/assets/cf0fa1d8-cc12-415d-ab55-d3b915860002" />


### 🛠️ Step 2: Real UI Implementation

* Converted wireframe into a **fully functional React application**
* Styled using **Tailwind CSS**
* Added real interactions:

  * Search & filtering
  * Product cards
  * Enquiry modal
  * Price comparison table
* Ensured responsiveness and smooth UX

This workflow follows **industry-standard frontend practice**:

> *Design first → validate layout → then build scalable UI*
> <img width="2112" height="4488" alt="B2B webpage" src="https://github.com/user-attachments/assets/1339b332-a2c0-4b78-96d5-413de9472da5" />


---

## 🎯 Project Objectives

* Enable users to **search and compare products** easily
* Display **seller-wise pricing** in a single view
* Allow buyers to **send enquiries without mandatory authentication**
* Provide sellers **visibility and storefronts** without their own website
* Implement a **clean, scalable full-stack architecture**
* Follow professional frontend & backend best practices

---

## 🧪 Tech Stack

### 🌐 Frontend

* ⚛️ **React (Vite)**
* 🎨 **Tailwind CSS**
* 🔀 **React Router**
* 🧠 Context API
* 📦 Component-based architecture

### ⚙️ Backend

* 🟢 **Node.js**
* 🚀 **Express.js**
* 🔐 **JWT Authentication**
* 📡 RESTful APIs

### 🗄️ Database & Storage

* 🍃 **MongoDB Atlas** (Cloud Database)
* ☁️ **Cloudinary** (Product image upload & management)

---

## ✨ Core Features

### 🔍 Product Discovery

* Search products by name
* Featured products section
* Grid-based product cards with highlights

### ⚖️ Price Comparison

* Dedicated comparison page
* Table-based seller price comparison
* Multiple sellers for the same product

### 🏪 Multi-Seller System

* Products linked to sellers
* Seller name shown directly from backend data
* Auto-generated seller storefront pages

### ✉️ Buyer Enquiry System

* Enquiry button on product cards
* Modal-based enquiry form
* Fields:

  * Name
  * Email
  * Mobile number (validated)
  * Product-specific message
* Client-side validation for better UX

### 🎨 UI / UX Enhancements

* Image zoom on hover
* Featured product badges
* Clean B2B marketplace UI
* Responsive layout

---

## 🧠 Frontend Architecture Highlights

* Reusable `ProductCard` component
* Enquiry logic encapsulated inside the card
* Section-specific UI logic (Featured Products)
* Static/mock data support for early UI demos
* API-ready service layer

---

## ⚙️ Backend Architecture Highlights

* MVC structure (Models, Controllers, Routes)
* MongoDB Atlas for scalable data storage
* Cloudinary integration for image handling
* JWT-based authentication
* Middleware-based request processing
* Validation on both client and server side

---

## 🔐 Validation & Security

* Frontend validation for UX
* Regex-based mobile number validation
* Backend re-validation for security
* JWT-protected routes
* Role-based access control (future-ready)

---

## 🧩📂 Project Folder Structure

### 📁 Root

```text
B2B/
├── backend/
└── frontend/
```

### 📁 Backend

```text
backend/
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── server.js
├── .env
└── package.json
```

### 📁 Frontend

```text
frontend/
├── src/
│   ├── components/
│   │   ├── EnquiryModal.jsx
│   │   ├── ProductCard.jsx
│   │   ├── PriceTable.jsx
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   └── HeroCarousel.jsx
│   │
│   ├── context/
│   ├── mocks/
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── FeaturedProducts.jsx
│   │   ├── ProductCompare.jsx
│   │   ├── SearchResult.jsx
│   │   ├── SellerPage.jsx
│   │   ├── SellerDashboard.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Profile.jsx
│   │
│   ├── services/
│   ├── App.jsx
│   ├── main.jsx
│   └── style.css
│
├── index.html
├── .env
└── package.json
```

---

## 🔌 API Endpoints (Sample)

```http
GET    /api/products/featured
GET    /api/products/search
GET    /api/products/compare/:id
POST   /api/enquiry
POST   /api/auth/login
POST   /api/auth/register
```

---

## 👥 Team Collaboration

This project was developed as a **group internship project** in a **single shared repository**.

### Contributors

* **Backend & Database Developer**: Ashutosh Ranjan
* **Backend & Database Developer**: Shivam Mandal
* **Frontend Developer**: Rupendra Kumar

---

## 📈 Future Enhancements

* 📤 Enquiry management dashboard for sellers
* ⭐ Seller ratings & reviews
* 💰 Price trend analysis
* 🔔 Notification system
* 🛒 Order & payment gateway
* 📊 Admin analytics dashboard

---

## 🙌 Internship Value

This project demonstrates:

* Full-stack development skills
* Real-world B2B marketplace logic
* UI/UX planning before development
* Frontend–backend collaboration
* Clean architecture & scalability
* Industry-ready coding practices

> *Frontend first for visualization, backend integration for production.*

---

## 📄 License

This project is **temporarily private** for learning, internship evaluation, and collaboration.
Once made public, feel free to fork, explore, and build upon it.

---

> *“Reference real platforms, design with intent, and build scalable systems.”* 🚀

---
