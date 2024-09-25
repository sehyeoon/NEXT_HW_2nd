"use client";

import React, { createContext, useState, useEffect } from "react";

// 1. createContext 함수를 사용해, Context 생성
export const CartContext = createContext();

// 2. Provider 컴포넌트 정의
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 클라이언트에서만 로컬스토리지를 사용할 수 있도록 useEffect 사용
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
