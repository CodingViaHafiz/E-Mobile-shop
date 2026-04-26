import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { orderApi } from "../services/orders";

const CartContext = createContext(null);
const STORAGE_KEY = "emobile-cart";

const readStoredCart = () => {
  try {
    const storedValue = localStorage.getItem(STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : [];
  } catch {
    return [];
  }
};

const normalizeCartProduct = (product, quantity = 1) => ({
  productId: product._id,
  name: product.name,
  brand: product.brand,
  model: product.model,
  price: product.price,
  ptaStatus: product.ptaStatus === "yes" ? "yes" : "no",
  image: product.images?.[0] || "",
  stock: product.stock,
  status: product.status,
  quantity,
});

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(readStoredCart);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = useCallback((product, quantity = 1) => {
    if (!product || product.stock <= 0) {
      return {
        success: false,
        message: "This product is currently out of stock",
      };
    }

    let response = { success: true, message: "Product added to cart" };

    setItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.productId === product._id,
      );

      if (!existingItem) {
        return [...currentItems, normalizeCartProduct(product, quantity)];
      }

      const nextQuantity = Math.min(existingItem.quantity + quantity, product.stock);

      if (nextQuantity === existingItem.quantity) {
        response = {
          success: false,
          message: "You already have the maximum available quantity in your cart",
        };
        return currentItems;
      }

      return currentItems.map((item) =>
        item.productId === product._id
          ? {
              ...item,
              quantity: nextQuantity,
              stock: product.stock,
              price: product.price,
              ptaStatus: product.ptaStatus === "yes" ? "yes" : "no",
              image: product.images?.[0] || item.image,
            }
          : item,
      );
    });

    return response;
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.productId !== productId) {
            return item;
          }

          const nextQuantity = Math.min(Math.max(quantity, 0), item.stock || quantity);
          return { ...item, quantity: nextQuantity };
        })
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.productId !== productId),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const syncProduct = useCallback((product) => {
    if (!product?._id) {
      return;
    }

    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.productId !== product._id) {
            return item;
          }

          const nextQuantity = Math.min(item.quantity, product.stock);

          return {
            ...item,
            stock: product.stock,
            price: product.price,
            ptaStatus: product.ptaStatus === "yes" ? "yes" : "no",
            image: product.images?.[0] || item.image,
            status: product.status,
            quantity: nextQuantity,
          };
        })
        .filter((item) => item.quantity > 0 && item.status !== "inactive"),
    );
  }, []);

  const syncProducts = useCallback((products = []) => {
    products.forEach(syncProduct);
  }, [syncProduct]);

  const checkout = useCallback(async (orderDetails) => {
    if (items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
      };
    }

    try {
      setSubmitting(true);
      const response = await orderApi.placeOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        ...orderDetails,
      });

      clearCart();

      return {
        success: true,
        message: "Order placed successfully",
        order: response.order,
      };
    } catch (error) {
      return {
        success: false,
        message: error?.response?.data?.message || "Failed to place order",
      };
    } finally {
      setSubmitting(false);
    }
  }, [clearCart, items]);

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      grandTotal: subtotal,
    };
  }, [items]);

  const contextValue = useMemo(
    () => ({
      items,
      submitting,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      syncProduct,
      syncProducts,
      checkout,
      ...totals,
    }),
    [
      items,
      submitting,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      syncProduct,
      syncProducts,
      checkout,
      totals,
    ],
  );

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
