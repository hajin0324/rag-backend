import { ChromaClient } from "chromadb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { HttpException } from "./httpException";
import { StatusCodes } from "http-status-codes";
import fs from "fs";
import csvParser from "csv-parser";
import path from "path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHROMA_SERVER_HOST = "http://localhost:8000";

class CustomOpenAIEmbeddings extends OpenAIEmbeddings {
  async generate(input: string[]): Promise<number[][]> {
    return await this.embedDocuments(input);
  }
}

export const parseCsvFile = async (filePath: string): Promise<any[]> => {
  const rows: any[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => rows.push(data))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
};

export const createChromaCollection = async (filePath: string) => {
  try {
    const client = new ChromaClient({
      path: CHROMA_SERVER_HOST,
    });

    const embeddings = new CustomOpenAIEmbeddings({
      model: "text-embedding-ada-002",
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    let collectionName = path.basename(filePath);
    collectionName = path.parse(collectionName).name;

    const collection = await client.createCollection({
      name: collectionName,
      embeddingFunction: embeddings,
    });

    const fileData = await parseCsvFile(filePath);
    const validRows = fileData.filter((row) => row.content && row.content.trim() !== "");
    if (validRows.length === 0) {
      throw new HttpException(StatusCodes.BAD_REQUEST, "파일에 데이터가 존재하지 않습니다.");
    }

    await collection.add({
      ids: fileData.map((_, index) => `id_${index}`),
      embeddings: await embeddings.generate(fileData.map((row) => row.content)),
      metadatas: validRows,
    });

    return collectionName;
  } catch (error) {
    throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, `Error creating ChromaDB collection: ${error}`);
  }
};

export const searchChromaDB = async (collectionName: string, question: string, messages: string, topK: number = 5) => {
  try {
    const queryContext = `${messages}\nUser: ${question}`;
    const client = new ChromaClient({ path: CHROMA_SERVER_HOST });

    const embeddings = new CustomOpenAIEmbeddings({
      model: "text-embedding-ada-002",
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const collection = await client.getCollection({
      name: collectionName,
      embeddingFunction: embeddings,
    });

    return await collection.query({ queryTexts: [queryContext], nResults: topK });
  } catch (error) {
    throw new HttpException(StatusCodes.INTERNAL_SERVER_ERROR, `Faile to query ChromaDB: ${error}`);
  }
};
