import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        {/* Navigation will go here */}
        <Routes>
          <Route path="/" element={<h1 className="text-3xl text-center pt-10">Welcome to E-Mobile Shop</h1>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
