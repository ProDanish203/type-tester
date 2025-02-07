import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRoomId = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("roomId");
};

export const getUsername = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("username");
};
