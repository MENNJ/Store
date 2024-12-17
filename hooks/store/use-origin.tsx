import { useEffect, useState } from "react";

// 定义一个自定义hook，用于获取当前页面的origin
export const useOrigin = () => {
  // 定义一个状态变量，用于判断组件是否已经挂载
  const [mounted, setMounted] = useState(false);
  // 获取当前页面的origin
  const origin = typeof window !== "undefined" && window.location.origin ? window.location.origin : "";

  // 组件挂载时，将mounted状态设置为true
  useEffect(() => {
    setMounted(true);
  }, []);

  // 如果组件还未挂载，则返回空字符串
  if (!mounted) {
    return '';
  }

  // 返回当前页面的origin
  return origin;
  
}