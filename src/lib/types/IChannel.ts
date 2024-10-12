export interface IChannel {
  name: string;
  id: string;
  description: string;
  createdUserId: string;
}

export interface IResponseChannel {
  message: string;
  data: IChannel[];
}
