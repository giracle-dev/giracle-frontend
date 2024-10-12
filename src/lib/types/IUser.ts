export interface IResponseUSerVerifyToken {
  success: boolean;
  message: string;
  data: {
    userId: string;
  }
}

export interface IUser {
  id: string;
  name: string;
  description: string;
}