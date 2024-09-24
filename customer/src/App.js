import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Routes, Route, Navigate } from "react-router-dom";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import HandleRedirect from "./components/HandleRedirect";

function App() {
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RouteControl>
            <HomePage />
          </RouteControl>
        }
      />
      <Route
        path="/cart"
        element={
          <RouteControl>
            <CartPage />
          </RouteControl>
        }
      />
      <Route path="/handle-redirect" element={<HandleRedirect />} />
      <Route path="*" element={<Navigate to="/" />} /> {/* Redirects unknown routes to home */}
    </Routes>
  );
}

export default App;

export const RouteControl = ({ children }) => {
    return children;
};
