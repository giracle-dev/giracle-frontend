import type { IMessage } from "./IMessage";
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

export interface IResponseChannelLeave {
  message: string;
}

export interface IResponseChannelSearch {
  message: string;
  data: IChannel[]
}

export interface IChannelHistory {
  history: IMessage[];
  atTop: boolean;
  atEnd: boolean;
}

export interface IResponseChannelHistory {
  history: any;
  message: string;
  data: IChannelHistory;
}
