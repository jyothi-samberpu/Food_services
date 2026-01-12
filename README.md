# Food Services

A full-stack food service management platform with a Node.js backend and React dashboard.

![License](https://img.shields.io/badge/license-ISC-blue.svg)

---

##  Overview

Food Services is a vendor management platform that allows food vendors to:
- Register and authenticate
- Create and manage their food firms/restaurants
- Add, view, and manage products
- Upload images for firms and products

---

## 📁 Project Structure

```
Food_services/
├── Backend/          # Node.js + Express API
│   ├── controllers/  # Business logic
│   ├── models/       # MongoDB schemas
│   ├── router/       # API routes
│   ├── middlewares/  # JWT auth middleware
│   └── uploads/      # Uploaded images
│
└── dashboard/        # React + Vite Frontend
    └── src/
        └── vendorDashboard/
            ├── components/
            ├── pages/
            └── utilitys/
```

---

### Prerequisites

- **Node.js** v18+ 
- **MongoDB** (local or MongoDB Atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Food_services.git
cd Food_services
```

### 2. Setup Backend

```bash
cd Backend
npm install
```

Create a `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

Then edit `.env` with your MongoDB connection string:

**Option A: MongoDB Atlas (Recommended)**
1. Create free account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Click "Connect" → "Connect your application"
4. Copy the connection string and replace `<password>` with your password

```env
PORT=4000
MONGO_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/food_services?retryWrites=true&w=majority
WHATISYOURWORK=your_secret_jwt_key_here
```

**Option B: Local MongoDB**
```env
PORT=4000
MONGO_URL=mongodb://localhost:27017/food_services
WHATISYOURWORK=your_secret_jwt_key_here
```

Start the server:
```bash
npm run dev
```

### 3. Setup Dashboard

Open a new terminal:
```bash
cd dashboard
npm install
npm run dev
```

### 4. Access the Application

- **Backend API**: http://localhost:4000
- **Dashboard**: http://localhost:5173

---

## 🛠 Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Multer (file uploads)
- bcryptjs (password hashing)
- CORS enabled

### Frontend
- React 19
- Vite 7
- React Router DOM 7
- Custom CSS styling

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/vendor/register` | Register vendor |
| POST | `/vendor/login` | Login vendor |
| GET | `/vendor/all-vendors` | Get all vendors |
| POST | `/firm/add-firm` | Add firm (auth) |
| GET | `/firm/all` | Get all firms |
| POST | `/product/add` | Add product (auth) |
| GET | `/product/all` | Get all products |
| DELETE | `/product/:id` | Delete product (auth) |

---

## 📝 Environment Variables

### Backend (.env)

> ⚠️ **Important**: Never commit `.env` file. Use `.env.example` as template.

```env
PORT=4000
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/food_services
WHATISYOURWORK=your_jwt_secret_key
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author : AR MIr

Created with ❤️ for food service vendors
