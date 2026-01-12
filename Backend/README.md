# Food Services - Backend

A modern food service platform backend built with Node.js, Express.js, and MongoDB. This API provides vendor authentication, firm management, product management, and image uploads.

---

## 🛠 Tech Stack

- **Node.js** (v18+ recommended)
- **Express.js** (v5.x)
- **MongoDB** (Mongoose v9.x)
- **JWT Authentication**
- **Multer** (File Uploads)
- **bcryptjs** (Password Hashing)
- **CORS** enabled
- **dotenv** (Environment Variables)

---

## 📁 Project Structure

```
Backend/
├── controllers/        # Business logic
│   ├── vendorController.js
│   ├── firmController.js
│   └── ProductController.js
├── models/             # Mongoose schemas
│   ├── Vendor.js
│   ├── Firm.js
│   └── Product.js
├── router/             # API routes
│   ├── vendorRouter.js
│   ├── firmRouter.js
│   └── productRouter.js
├── middlewares/        # JWT verification
│   └── verifyToken.js
├── uploads/            # Uploaded images
├── .env                # Environment variables (create this)
├── index.js            # Entry point
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **npm** (comes with Node.js)
- **MongoDB** (local or MongoDB Atlas)

### Installation

1. Clone the repository
2. Navigate to Backend folder:
   ```bash
   cd Backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file with the following variables:
   ```env
   PORT=4000
   MONGO_URL=mongodb://localhost:27017/food_services
   WHATISYOURWORK=your_secret_jwt_key_here
   ```
   
   For MongoDB Atlas, use:
   ```env
   MONGO_URL=mongodb+srv://<username>:<password>@cluster.xxxxx.mongodb.net/food_services
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

The server will run at `http://localhost:4000`

---

## 📡 API Endpoints

### Vendor Routes (`/vendor`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/register` | Register new vendor | No |
| POST | `/login` | Login vendor | No |
| GET | `/all-vendors` | Get all vendors | No |
| GET | `/single-vendor/:id` | Get vendor by ID | No |

### Firm Routes (`/firm`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/add-firm` | Add new firm | Yes |
| GET | `/all` | Get all firms | No |
| GET | `/:id` | Get firm by ID | No |
| DELETE | `/:id` | Delete firm | Yes |

### Product Routes (`/product`)
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/add` | Add new product | Yes |
| GET | `/all` | Get all products | No |
| GET | `/:id` | Get product by ID | No |
| DELETE | `/:id` | Delete product | Yes |

---

## 🔐 Authentication

Protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your_token>
```

---

## 📦 Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server

---

## License

ISC

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
