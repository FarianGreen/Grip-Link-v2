export interface IUser {
  bio: string;
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: "user" | "admin";
}

export interface IAuthState {
  user: IUser | null;
  users: IUser[];
  isLogined: boolean;
  loading: boolean;
  error: string | null;
}

export interface IProfileState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}
