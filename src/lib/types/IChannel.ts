export interface IChannel {
  name: string;
  id: string;
  description: string;
  createdUserId: string;
}

export interface IResponseChannelList {
  message: string;
  data: IChannel[];
}
