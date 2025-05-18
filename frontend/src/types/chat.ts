import { IMessage } from "./message";
import { IUser } from "./user";

export interface IChat {
  chatId: number;
  users: IUser[];
  lastMessage?: IMessage;
}

export interface IChatState {
  chats: IChat[];
  selectedChatId: number | null;
  messages: IMessage[];
}
export interface ErrorResponse {
  message: string;
  statusCode?: number;
}