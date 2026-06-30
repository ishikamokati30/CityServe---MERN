import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cityserve_cart') || '[]'));

  useEffect(() => {
    localStorage.setItem('cityserve_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, quantity = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i.productId === product._id);
      if (exists) {
        return prev.map(i => i.productId === product._id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        discountedPrice: product.discountedPrice,
        discountPercent: product.discountPercent,
        image: product.image,
        shop: product.shop,
        quantity,
      }];
    });
  };

  const removeFromCart = (productId) => setCart(prev => prev.filter(i => i.productId !== productId));

  const updateQty = (productId, quantity) => {
    if (quantity < 1) return removeFromCart(productId);
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, quantity } : i));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + (i.discountedPrice || i.price) * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
