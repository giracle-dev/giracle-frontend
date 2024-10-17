export interface IChannel {
  name: string;
  id: string;
  description: string;
  createdUserId: string;
  isArchived: boolean;
}

export interface IResponseChannelList {
  message: string;
  data: IChannel[];
}

export interface IResponseChannelJoin {
  message: string;
  data: {
    channelId: string;
  };
}

