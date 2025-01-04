export type ChatHistory = {
  id: number;
  title: string;
  updatedAt: Date;
};

export type ChatMessage = {
  id: number;
  role: string;
  content: string;
  createdAt: Date;
};
