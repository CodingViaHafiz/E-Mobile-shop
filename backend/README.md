# E-Mobile Shop Backend

Production-ready backend API for E-Mobile Shop using Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Edit the `.env` file and set your configuration:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/emobileshop
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here
```

### 3. Start the Server

**Development mode (with auto-reload):**

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

The server will run on `http://localhost:5000`

## Project Structure

```
backend/
├── config/           # Database connection & configuration
├── controllers/      # Request handlers for routes
├── middleware/       # Express middleware (error handling, CORS, etc.)
├── models/          # MongoDB schemas
├── routes/          # API routes
├── server.js        # Main server file
├── .env             # Environment variables
├── .gitignore       # Git ignore rules
└── package.json     # Dependencies
```

## Available Endpoints

- `GET /api/health` - Server health check

## Dependencies

- **express** - Web framework
- **mongoose** - MongoDB object modeling
- **cors** - CORS middleware
- **dotenv** - Environment variable management
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **nodemon** - Development auto-reload (dev only)

## Next Steps

1. Create models in `models/` folder
2. Create controllers in `controllers/` folder
3. Create routes in `routes/` folder
4. Connect routes to server.js
5. Implement authentication middleware
