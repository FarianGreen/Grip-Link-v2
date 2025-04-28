export interface IUser {
  bio: string;
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
}
