export type UserDetails = {
  id: string;
  userName: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type AuthUserDetails = {
  id?: string;
  userName: string;
  password: string;
};

export type TokenType = "normal" | "refresh";
