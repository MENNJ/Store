"use client";

import { useEffect, useState } from "react";

const formatter = new Intl.NumberFormat('zh-CN', {
  style: 'currency',
  currency: 'CNY',
});

interface CurrencyProps {
  value?: string | number;
  className?: string; // Add className prop
}

const Currency: React.FC<CurrencyProps> = ({
  value = 0,
  className = "", // Default to an empty string
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return ( 
    <div className={`font-semibold text-rose-600 ${className}`}>
      {formatter.format(Number(value))}
    </div>
  );
};

export default Currency;
