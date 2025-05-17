import { useRef } from "react";

export function useRenderLogger(name) {
  if (!import.meta.env.DEV) return; 
  const count = useRef(1);
  console.log(`${name} render #${count.current++}`);
}