# venket_services

Venket Services is a modern service platform dedicated to connecting vendors, businesses, and customers seamlessly. Our goal is to simplify the way services and products are offered, managed, and accessed, providing a reliable and efficient digital solution for small businesses and enterprises alike.

# Venket Services – Backend

This repository contains the **backend service** for **Venket Services**, built using **Node.js, Express.js, and MongoDB**. It provides APIs for vendor authentication, firm management, product management, and image uploads.

---

🛠 Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **Multer (File Uploads)**
- **dotenv**
- **Nodemon (Development)**

---

// Project Structure

```
venket_services/
│
├── controllers/        # Business logic
├── models/             # Mongoose schemas
├── routes/             # API routes
├── middlewares/        # JWT & other middlewares
├── uploads/            # Uploaded images
├── .env                # Environment variables
├── index.js            # Entry point
├── package.json
└── README.md
```

---

## Prerequisites

Make sure you have the following installed:

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **MongoDB** (local or MongoDB Atlas)

---

## 🚀 Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone <your-repo-url>
cd venket_services
```

---

### 2️⃣ Install Dependencies

npm install

This will install all required backend dependencies.

---

### 3️⃣ Environment Variables

Create a `.env` file in the root directory:

```env
PORT=4000
MONGO_URI=your_mongodb_connection_string
WHATISYOURWORK=your_jwt_secret_key
```

⚠️ **Never commit `.env` to GitHub**

---

### 4️⃣ Start the Server

#### Development Mode (Recommended)

```bash
npm run dev
```

#### Production Mode

npm start

Server will start at:
http://localhost:4000

## 🔐 Authentication

- JWT-based authentication
- Token must be sent in request headers

Example:

```
headers: {
  token: <JWT_TOKEN>
}
```

---

## 📦 API Modules

### Vendor

- Register vendor
- Login vendor

### Firm

- Add firm (Protected)
- Fetch firm details

### Products

- Add product (with image)
- Fetch products

---

## 🖼 File Uploads

- Images are stored in the `uploads/` directory
- Handled using **Multer**

---

## ❗ Common Issues

- **ECONNREFUSED** → MongoDB not running
- **Token Missing** → Send JWT in headers
- **res.send is not a function** → Typo (`res.semd` ❌)

---

## 🧪 Testing APIs

Use tools like:

- **Postman**
- **Thunder Client (VS Code)**

---

## 📌 Scripts

```json
"scripts": {
  "start": "node index.js",
  "dev": "nodemon index.js"
}
```

---

## 👨‍💻 Author

**Jyothi (Venket Services)**

---

## 📜 License

This project is for learning and internal use.

---

✅ Backend setup is complete and ready to use.

next...

Frontend
