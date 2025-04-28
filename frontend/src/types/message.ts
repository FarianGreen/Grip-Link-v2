import { IUser } from "./user";

export interface IReadBy {
  id: number;
}
export interface IMessage {
  id: number;
  content: string;
  createdAt: string;
  sender: IUser;
  receiver?: IUser;
  readBy?: IReadBy[];
  isEdited: boolean;
}
