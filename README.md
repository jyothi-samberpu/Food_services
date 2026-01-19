# Food Services - Full Stack Application

A complete food vendor management system with React frontend and Node.js backend.

## Features

- ✅ Vendor Authentication (Register/Login with JWT)
- ✅ Firm Management
- ✅ Product Management
- ✅ Image Uploads
- ✅ Secure API with Helmet & CORS
- ✅ Rate Limiting
- ✅ Request Logging (Morgan)
- ✅ MongoDB Integration
- ✅ Production Ready

## Tech Stack

**Backend:**

- Node.js + Express
- MongoDB with Mongoose
- JWT Authentication
- Security: Helmet, CORS, Rate Limiting
- Logging: Morgan

**Frontend:**

- React 19
- Vite
- React Router
- Responsive Design

## Quick Start

### Prerequisites

- Node.js 16+
- MongoDB Atlas account
- Git

### Installation

```bash
# Clone repository
git clone <your-repo-url>
cd Food_services

# Install all dependencies
npm run install:all

# Copy environment template
cp Backend/.env.example Backend/.env
# Edit Backend/.env with your MongoDB URL and JWT secret
```

### Development

```bash
# Start both servers (backend on 4000, frontend on 5173)
npm run dev
```

Access:

- Frontend: http://localhost:5173
- Backend: http://localhost:4000

### Production Build

```bash
# Build frontend
npm run build

# Start backend only
npm start
```

## Project Structure

```
Food_services/
├── Backend/              # Express server
│   ├── controllers/      # Route controllers
│   ├── models/          # MongoDB schemas
│   ├── router/          # Express routes
│   ├── middlewares/     # Auth & custom middleware
│   └── index.js         # Main server file
├── dashboard/           # React frontend
│   ├── src/
│   │   ├── vendorDashboard/
│   │   │   ├── components/  # Reusable components
│   │   │   ├── forms/       # Form components
│   │   │   └── pages/       # Page components
│   │   └── App.jsx
│   └── package.json
├── package.json         # Root workspace config
└── Procfile            # Heroku deployment
```

## API Endpoints

### Vendor

- `POST /vendor/register` - Register new vendor
- `POST /vendor/login` - Login vendor
- `GET /vendor/all` - Get all vendors

### Firm

- `POST /firm/add-firm` - Add firm (auth required)
- `GET /firm/all` - Get all firms

### Product

- `POST /product/add` - Add product (auth required)
- `GET /product/all` - Get all products

## Environment Variables

### Backend (.env)

```env
PORT=4000
NODE_ENV=production
MONGO_URL=mongodb+srv://user:pass@cluster.mongodb.net/dbname
JWT_SECRET=your_super_secret_key_min_32_chars
FRONTEND_URL=https://your-frontend-domain.com
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy (Heroku)

```bash
heroku create your-app-name
git push heroku main
```

## Security

- JWT-based authentication
- Helmet.js for security headers
- Rate limiting on auth endpoints
- CORS configured for production
- Environment variables for sensitive data
- MongoDB password-protected connections

## Monitoring

- Request logs: `Backend/logs/access.log`
- Console output in development
- Error logging included

## License

ISC

## Author

Jyothi
