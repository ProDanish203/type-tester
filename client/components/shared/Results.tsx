"use client";
import { Card, CardContent, CardHeader } from "../ui/card";
import { motion } from "framer-motion";
import { ResultsProps } from "@/types/types";

export const Results: React.FC<ResultsProps> = ({
  state,
  errors,
  accuracy,
  wpm,
}) => {
  if (state !== "finish") return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <Card className="bg-bgCol max-w-[700px] w-full mx-auto">
        <CardHeader>
          <h2 className="text-white text-2xl font-semibold tracking-wider">
            Results
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col justify-between">
            <p className="text-lg text-gray-500 tracking-wider">
              WPM: <span className="text-primaryCol font-bold">{wpm}</span>
            </p>
            <p className="text-lg text-gray-500 tracking-wider">
              Accuracy:{" "}
              <span className="text-primaryCol font-bold">
                {accuracy.toFixed(2)}%
              </span>
            </p>
            <p className="text-lg text-gray-500 tracking-wider">
              Errors:{" "}
              <span className="text-primaryCol font-bold">{errors}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
