# Food Services - Dashboard

A modern vendor dashboard built with React 19 and Vite. This frontend allows vendors to manage their firms and products.

---

## 🛠 Tech Stack

- **React 19**
- **Vite 7**
- **React Router DOM 7**
- **CSS** (Custom styling)

---

## 📁 Project Structure

```
dashboard/
├── src/
│   ├── vendorDashboard/
│   │   ├── components/
│   │   │   ├── NavBar.jsx
│   │   │   ├── SideBar.jsx
│   │   │   ├── AllProducts.jsx
│   │   │   └── forms/
│   │   │       ├── Login.jsx
│   │   │       ├── Register.jsx
│   │   │       ├── AddFirm.jsx
│   │   │       └── AddProduct.jsx
│   │   ├── pages/
│   │   │   └── LandingPage.jsx
│   │   └── utilitys/
│   │       └── Apipath.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)

### Installation

1. Navigate to dashboard folder:
   ```bash
   cd dashboard
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The dashboard will run at `http://localhost:5173`

---

## ✨ Features

- **Vendor Authentication**: Login and Register
- **Firm Management**: Add firms with images, categories, and regions
- **Product Management**: Add products with images and descriptions
- **View All Products**: Browse and delete products
- **Responsive Design**: Dark themed modern UI

---

## 🔗 API Configuration

The API endpoint is configured in `src/vendorDashboard/utilitys/Apipath.js`:

```javascript
const API_PATH = "http://localhost:4000";
export default API_PATH;
```

Make sure the backend server is running on port 4000.

---

## 📦 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

---

## License

ISC
