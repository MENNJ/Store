"use client";

import React, { useState, useEffect } from "react";
import gsap from "gsap"; // 导入 GSAP
import ProductCard from "@/components/ui/product-card";
import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import useMasonry from "@/lib/useMasonry";
import SearchInput from "@/components/searchInput";

interface ProductListProps {
  title: string;
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(items);
  const masonryContainer = useMasonry();

  useEffect(() => {
    if (searchTerm) {
      setFilteredProducts(
        items.filter((item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredProducts(items);
    }
  }, [searchTerm, items]);

  useEffect(() => {
    gsap.fromTo(
      ".product-card",
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, stagger: 0.1, duration: .7, ease: "power2.out" }
    );
  }, [filteredProducts]);

  return (
    <div className="space-y-6 mt-4">

      <div className="flex justify-around items-center gap-4 mb-8">
        <h3 className="font-bold xl:text-3xl lg:text-3xl md:text-2xl sm:text-xl whitespace-nowrap">{title}</h3>
        <SearchInput setSearchTerm={setSearchTerm} />
      </div>

      {filteredProducts.length === 0 && <NoResults />}

      <div
        ref={masonryContainer}
        className="grid items-start grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
      >
        {filteredProducts.map((item) => (
          <div key={item.id} className="product-card">
            <ProductCard data={item} />
          </div>
        ))}
      </div>

    </div>
  );
};

export default ProductList;
