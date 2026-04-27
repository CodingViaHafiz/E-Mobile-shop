import React from "react";
import { Link } from "react-router-dom";
import { COLORS } from "../constants/designTokens";

export const Footer = () => {
  return (
    <footer
      className="border-t"
      style={{
        background: `linear-gradient(135deg, ${COLORS.primary.main}10, ${COLORS.primary.main}05)`,
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">

        {/* Left */}
        <p className="text-neutral-700 font-medium">
          © {new Date().getFullYear()} E-Mobile
        </p>

        {/* Right */}
        <div className="flex gap-4 text-neutral-600">
          <Link to="/" className="hover:text-blue-600 transition">
            Home
          </Link>
          <Link to="/shop" className="hover:text-blue-600 transition">
            Shop
          </Link>
          <Link to="/contact" className="hover:text-blue-600 transition">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};