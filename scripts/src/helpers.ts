import fs from "fs";
import { BATCH_SIZE } from "./constants";

interface Quote {
  quote: string;
  movie: string;
  type: string;
  year: number;
}

export const readFromJson = (path: string, writeFilePath: string) => {
  let fileData: Quote[] = [];
  if (fs.existsSync(path)) {
    const fileContent = fs.readFileSync(path, "utf-8");
    if (fileContent.trim()) {
      fileData = JSON.parse(fileContent);
    }
  } else {
    console.log("File does not exist");
  }

  const quotes = fileData.map((data) => data.quote);
  saveDataToJson(quotes, writeFilePath);
};

export async function saveDataToJson(data: string[], writeFilePath: string) {
  try {
    let existingData: string[] = [];

    if (fs.existsSync(writeFilePath)) {
      const fileContent = fs.readFileSync(writeFilePath, "utf-8");
      if (fileContent.trim()) {
        try {
          existingData = JSON.parse(fileContent);
        } catch (err) {
          console.error("Error parsing JSON: ", err);
          existingData = [];
        }
      }
    } else {
      console.log("File does not exist");
    }

    existingData.push(...data);
    existingData = Array.from(new Set(existingData));
    const cleanedData = cleanData(existingData);

    fs.writeFileSync(writeFilePath, JSON.stringify(cleanedData, null, 2));
  } catch (err) {
    console.error("Data Append Error: ", err);
  }
}

export async function readFromCsv(path: string, writeFilePath: string) {
  if (!fs.existsSync(path)) {
    console.log("CSV file does not exist");
    return;
  }

  // Reading the CSV as a stream to avoid memory issues on large files
  const fileStream = fs.createReadStream(path, "utf-8");
  let buffer = "";
  let batch: string[] = [];
  let batchNumber = 0;

  fileStream.on("data", async (chunk) => {
    buffer += chunk;
    let lines = buffer.split("\n");

    buffer = lines.pop() || "";

    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(",");
      const quote = currentLine[0];

      if (quote) batch.push(quote);

      if (batch.length >= BATCH_SIZE) {
        await saveDataToJson(batch, writeFilePath);
        console.log("Batch processed", batchNumber++);
        batch = [];
      }
    }
  });

  fileStream.on("end", async () => {
    if (batch.length > 0) {
      await saveDataToJson(batch, writeFilePath);
      console.log("Batch processed on end", batchNumber++);
    }
    console.log("CSV processing complete.");
    fileStream.destroy(); // Close the stream
  });

  fileStream.on("error", (err) => {
    console.error("Error reading CSV file:", err);
    fileStream.destroy(); // Close the stream
  });
}

function cleanData(quotes: string[]): string[] {
  return quotes
    .map((quote) => quote.replace(/[^a-zA-Z0-9\s']/g, "").trim())
    .filter((quote) => quote.length > 0);
}
