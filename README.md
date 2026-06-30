# 🏙️ CityServe — MERN Stack Local Commerce Platform

A full-stack web app connecting local shops with buyers. Built with MongoDB, Express, React, Node.js.

## Features
- **Buyer:** Browse cities → shops → products/services → cart → checkout → order tracking
- **Seller:** Dashboard with revenue stats, shop/product/service CRUD, order management with status updates
- **Auth:** JWT-based login/register, role-based routing (buyer vs seller)
- **Cart:** Persistent localStorage cart with coupon support
- **Orders:** Full lifecycle (pending → confirmed → preparing → out for delivery → delivered)

## Quick Start

### 1. Backend
```bash
cd backend
cp .env.example .env        # edit MONGO_URI if needed
npm install
node seed.js                # seed cities + coupons
npm start                   # runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm start                   # runs on http://localhost:3000
```

## Test Accounts
Register via the app — choose Buyer or Seller role on registration.

## Demo Coupon Codes (after seeding)
- `WELCOME20` — 20% off on orders above ₹200
- `SAVE50` — 10% off on orders above ₹500

## Tech Stack
| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6, Axios, react-hot-toast, Lucide icons |
| Backend | Node.js, Express.js, Mongoose |
| Database | MongoDB |
| Auth | JWT + bcryptjs |
| File Upload | Multer |

## API Routes
| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET | /api/cities | Public |
| GET | /api/shops | Public |
| GET | /api/shops/:id | Public |
| POST | /api/shops | Seller |
| GET | /api/products | Public |
| POST | /api/products | Seller |
| POST | /api/orders | Buyer |
| GET | /api/orders | Buyer |
| GET | /api/owner/dashboard | Seller |
| GET | /api/owner/orders | Seller |
| PUT | /api/owner/orders/:id/status | Seller |
