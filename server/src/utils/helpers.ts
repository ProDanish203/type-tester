import { CustomError } from "../middlewares/error.middleware";
import fs from "fs";
import { FILE_PATH } from "./constants";

export const throwError = (
  message: string | any,
  statusCode?: number
): CustomError => {
  const error = new Error(message) as CustomError;
  error.statusCode = statusCode || 500;
  return error;
};

export const generateUniqueRoomId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const getDataFromFile = async (
  path: string
): Promise<string[] | null> => {
  let data: string[] = [];

  if (fs.existsSync(path)) {
    const fileContent = fs.readFileSync(path, "utf-8");
    if (fileContent.trim()) {
      data = JSON.parse(fileContent);
    }
  } else {
    console.log("File does not exist");
    return null;
  }
  return data;
};

export const getWords = async (wordCount: number): Promise<string | null> => {
  const data = await getDataFromFile(FILE_PATH);
  if (!data || data.length === 0) return null;

  // Get a random starting point in the array
  const randomIndex = Math.floor(Math.random() * data.length);
  let selectedSentence = data[randomIndex];
  let words = selectedSentence.split(" ");

  // If the first sentence doesn't have enough words, we'll add more
  if (words.length < wordCount) {
    // Create a set to track used indices to avoid duplicates
    const usedIndices = new Set([randomIndex]);

    while (words.length < wordCount && usedIndices.size < data.length) {
      // Get another random sentence
      let newIndex;
      do {
        newIndex = Math.floor(Math.random() * data.length);
      } while (usedIndices.has(newIndex));

      usedIndices.add(newIndex);

      // Add words from the new sentence
      const additionalWords = data[newIndex].split(" ");
      words = [...words, ...additionalWords];
    }
  }

  // Trim to exact word count and join
  return words.slice(0, wordCount).join(" ");
};
