# E-Mobile Shop Frontend

Modern React frontend using Vite, React Router, Tailwind CSS, and Axios.

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The application will run on `http://localhost:5173`

## Building for Production

```bash
npm run build
```

## Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/          # Page components
│   ├── services/       # API service & utilities
│   ├── store/          # State management (Context/Redux)
│   ├── App.jsx         # Main App component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles with Tailwind
├── public/             # Static assets
├── index.html          # HTML entry point
├── vite.config.js      # Vite configuration
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
├── .gitignore          # Git ignore rules
└── package.json        # Dependencies
```

## Configuration

### API Service (src/services/api.js)

- Pre-configured Axios instance with API base URL
- Automatic JWT token injection in request headers
- Ready for interceptors

### Tailwind CSS

- Configured with PostCSS
- Autoprefixer enabled
- Dark mode ready

### Vite Proxy

- API requests to `/api/*` are proxied to `http://localhost:5000`
- Configured in `vite.config.js`

## Dependencies

- **react** - UI library
- **react-dom** - React DOM rendering
- **react-router-dom** - Client-side routing
- **axios** - HTTP client
- **tailwindcss** - Utility-first CSS framework
- **vite** - Next generation frontend tooling

## Usage Examples

### Making API Calls

```javascript
import axiosInstance from "./services/api";

// GET request
const fetchProducts = async () => {
  const response = await axiosInstance.get("/products");
  return response.data;
};

// POST request
const createProduct = async (productData) => {
  const response = await axiosInstance.post("/products", productData);
  return response.data;
};
```

### Using React Router

```javascript
import { Routes, Route, Link } from "react-router-dom";

<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/products" element={<Products />} />
  <Route path="/product/:id" element={<ProductDetail />} />
</Routes>;
```

## Next Steps

1. Create page components in `pages/` folder
2. Create reusable components in `components/` folder
3. Setup state management in `store/` folder
4. Create API service functions
5. Implement routing structure
6. Add Tailwind styles to components
