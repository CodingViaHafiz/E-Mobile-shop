# E-Mobile Shop - MERN Stack

A production-ready MERN (MongoDB, Express, React, Node.js) stack project for an E-Commerce mobile shop.

## Project Overview

This project follows industry best practices and modern development standards:

- **Clean Architecture** - Separated concerns with clear folder structure
- **Scalability** - Modular design for easy feature additions
- **Modern Stack** - Using latest stable versions of all technologies
- **Security** - JWT authentication, password hashing with bcryptjs
- **Performance** - Vite for fast development builds, Tailwind CSS for optimized styling

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Application runs on: `http://localhost:5173`

## Project Structure

```
E-Mobile shop/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── server.js        # Main server
│   ├── .env             # Environment variables
│   └── package.json     # Backend dependencies
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── store/       # State management
    │   ├── App.jsx      # Main app component
    │   └── main.jsx     # Entry point
    ├── public/          # Static assets
    ├── vite.config.js   # Vite configuration
    ├── tailwind.config.js# Tailwind configuration
    └── package.json     # Frontend dependencies
```

## Technology Stack

### Backend

- **Express.js** - Web server framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

### Frontend

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **React Router v6** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **PostCSS** - CSS processing

## Development Workflow

1. **Backend Development**
   - Create models in `backend/models/`
   - Create controllers in `backend/controllers/`
   - Create routes in `backend/routes/`
   - Connect routes to `server.js`

2. **Frontend Development**
   - Create components in `src/components/`
   - Create pages in `src/pages/`
   - Use `src/services/api.js` for API calls
   - Implement routing in `App.jsx`

3. **API Communication**
   - Frontend proxies to `/api/*` → backend port 5000
   - Axios instance auto-injects JWT tokens

## Production Build

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run build
npm run preview
```

## Environment Setup

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emobileshop
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

## Best Practices Implemented

✅ ES6 Modules across the project
✅ Global error handling middleware
✅ CORS configuration
✅ Clean folder structure
✅ Environment variable management
✅ API service layer abstraction
✅ JWT authentication setup
✅ Modular and scalable architecture
✅ No unnecessary comments
✅ Industry-standard folder organization

## Next Steps

1. Create MongoDB schemas in `backend/models/`
2. Build API controllers and routes
3. Create React components and pages
4. Setup state management (Context API or Redux)
5. Implement authentication flow
6. Deploy to production

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running locally or update `MONGODB_URI` in `.env`

### CORS Issues

- Check CORS configuration in `backend/middleware/corsConfig.js`
- Ensure frontend URL is allowed

### Port Already in Use

- Backend: Change `PORT` in `.env`
- Frontend: Change port in `frontend/vite.config.js`

---

**Happy Coding! 🚀**
