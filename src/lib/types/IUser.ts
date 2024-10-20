export interface IResponseUSerVerifyToken {
  message: string;
  data: {
    userId: string;
  };
}

export interface IResponseUserinfo {
  message: string;
  data: IUser;
}

export interface IResponseUserList {
  message: string;
  data: IUser[];
}

export interface IUser {
  id: string;
  name: string;
  selfIntroduction: string;
  ChannelJoin: {
    channelId: string;
  }[];
  RoleLink: {
    roleId: string;
  }[];
}

export interface IResponseOnlineUserList {
  message: string;
  data: string[];
}
