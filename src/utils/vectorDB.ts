import { ChromaClient } from "chromadb";
import { OpenAIEmbeddings } from "@langchain/openai";
import { HttpException } from "./httpException";
import { StatusCodes } from "http-status-codes";
import path from "path";
import fs from "fs";
import sqlite3 from "sqlite3";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const CHROMA_SERVER_HOST = "http://localhost:8000";

class CustomOpenAIEmbeddings extends OpenAIEmbeddings {
  async generate(input: string[]): Promise<number[][]> {
    return await this.embedDocuments(input);
  }
}

export const createChromaCollection = async (collectionName: string) => {
  try {
    const client = new ChromaClient({
      path: CHROMA_SERVER_HOST,
    });

    const embeddings = new CustomOpenAIEmbeddings({
      model: "text-embedding-ada-002",
      openAIApiKey: process.env.OPENAI_API_KEY!,
    });

    const collection = await client.getOrCreateCollection({
      name: collectionName,
      embeddingFunction: embeddings,
    });

    return collection;
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
