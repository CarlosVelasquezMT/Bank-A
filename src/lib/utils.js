import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const generateAccountNumber = () => {
  return "BOA-" + Math.floor(Math.random() * 10000000000).toString().padStart(10, '0');
};

export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};