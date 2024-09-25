"use client"; 

import React from "react";
import { GNB } from "../src/components/GNB";
import { GNB_TYPE, PRODUCTS } from "../src/constants/common";
import { Product } from "../src/components/Product";
import { Box } from "../src/styles/StyleComponent";

export default function HomePage() {
  return (
    <div>
      <GNB type={GNB_TYPE.MAIN} />
      <Box gap={30}>
        {PRODUCTS.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </Box>
    </div>
  );
}
