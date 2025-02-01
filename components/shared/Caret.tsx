"use client";
import React from "react";
import { motion } from "framer-motion";

export const Caret = () => {
  return (
    <motion.div
      aria-hidden={true}
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
      className="inline-block bg-primaryCol w-0.5 h-7"
    />
  );
};
