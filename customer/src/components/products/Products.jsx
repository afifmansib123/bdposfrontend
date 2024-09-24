import React, { useState } from "react";
import ProductItem from "./ProductItem";

const Products = ({ categories, filtered, products, setProducts, search }) => {
  return (
    <div className="products-wrapper grid grid-cols-card gap-4">
      {filtered.filter((product) => product.title && product.title.toLowerCase().includes(search))
        .map((item, _id) => (
          <ProductItem item={item} key={item._id} />
        ))}
    </div>
  );
};

export default Products;